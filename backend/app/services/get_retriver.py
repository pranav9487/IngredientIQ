import os
from dotenv import load_dotenv
load_dotenv()
os.environ["OPENAI_API_KEY"]= os.getenv("OPENAI_API_KEY")
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_groq import chat_models
embeddings= OpenAIEmbeddings(model="text-embedding-3-small",dimensions=1536)

index_name ="ingredients-iq"
vectorstore =PineconeVectorStore(index_name= index_name,embedding=embeddings)

def retrieve_ingredient(query: str):
    exact_results = vectorstore.similarity_search_with_score(
        query=query,
        k=2
    )
    exact_matches = []

    for doc, score in exact_results:

        ingredient_name = (
            doc.metadata.get("ingredient_name", "")
            .strip()
            .lower()
        )

        if ingredient_name == query.lower():

            exact_matches.append(doc)

    if exact_matches:

        return {
            "type": "exact_match",
            "results": exact_matches
        }


    return {
        "type": "semantic_match",
        "results": exact_results
    }

# results = retrieve_ingredient(
#     "Sodium hydroxide"
# )
# print(results)
