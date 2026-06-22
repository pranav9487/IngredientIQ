import getpass
import os
from dotenv import load_dotenv

import pandas as pd
from langchain_core.documents import Document
from pinecone import Pinecone
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

load_dotenv()

# ── OpenAI Embeddings ──────────────────────────────────────

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    dimensions=1536
)

# ── Pinecone ───────────────────────────────────────────────

pinecone_api_key = os.environ.get("PINECONE_API_KEY")

pc = Pinecone(api_key=pinecone_api_key)

index_name = "ingredients-iq"

# ── Files Configuration ────────────────────────────────────

files = [
    {
        "path": "../data/annex2.csv",
        "annex": "Annex II",
        "regulation_type": "Banned Substances",
        "skiprows": 10,
        "sep": "\t"
    },
    {
        "path": "../data/annex3.csv",
        "annex": "Annex III",
        "regulation_type": "Restricted Substances",
        "skiprows": 10,
        "sep": "\t"
    },
    {
        "path": "../data/annex5.csv",
        "annex": "Annex V",
        "regulation_type": "Preservatives",
        "skiprows": 5,
        "sep": ","
    }
]

# ── Semantic Document Creation ─────────────────────────────

all_documents = []

for file in files:

    df = pd.read_csv(
        file["path"],
        sep=file["sep"],
        skiprows=file["skiprows"],
        dtype=str
    )

    df = df.dropna(how="all")
    df.columns = [str(col).strip().replace('"', '') for col in df.columns]


    for index, row in df.iterrows():

        ingredient_name = str(row.get("Name", row.get("Chemical name / INN", ""))).strip()

        if (
            ingredient_name == ""
            or ingredient_name.lower() == "nan"
            or ingredient_name.lower() == "header"
        ):
            continue

        formatted_content = f"""
Regulation Annex:
{file['annex']}

Regulation Type:
{file['regulation_type']}
"""

        # Add all useful columns dynamically
        for column, value in row.items():

            if pd.notna(value):

                value = str(value).strip()

                if value and value.lower() != "nan":

                    formatted_content += f"""

{column}:
{value}
"""

        # ── Create Document ──────────────────────────

        doc = Document(
            page_content=formatted_content,
            metadata={
                "source_file": file["path"],
                "annex": file["annex"],
                "regulation_type": file["regulation_type"],
                "ingredient_name": ingredient_name,
                "row_number": index
            }
        )

        all_documents.append(doc)



# for doc in all_documents[:5]:

#     print(doc.page_content)
#     print("=" * 80)
print(f"Total documents created: {len(all_documents)}")
vectorstore = PineconeVectorStore.from_documents(
    documents=all_documents,
    embedding=embeddings,
    index_name=index_name
)

print(" Documents embedded and uploaded successfully!")


