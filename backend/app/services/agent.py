import os
from dotenv import load_dotenv

load_dotenv()
from langchain_core.output_parsers import PydanticOutputParser
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from app.Schema.schema import IngredientAnalysis
from app.services.get_retriver import retrieve_ingredient

grok_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model="llama-3.3-70b-versatile", groq_api_key=grok_api_key)


def analyse_ingredient(item: str):
    retrieval_result = retrieve_ingredient(item)
    retrieve_type = retrieval_result["type"]
    documents = retrieval_result["results"]

    # Limit to top 2 documents to stay within context limits
    documents = documents[:2]

    context = ""
    for doc_item in documents:
        if retrieve_type == "exact_match":
            doc = doc_item
            score_info = ""
        else:
            doc, score = doc_item
            score_info = f" (Similarity: {score:.2f})"
        
        # Extract metadata for a more compact context
        meta = doc.metadata
        context += f"""
---
Ingredient: {meta.get('ingredient_name', 'Unknown')} {score_info}
Annex/Status: {meta.get('annex_type', 'N/A')} / {meta.get('status', 'N/A')}
Snippet: {doc.page_content[:500]}
---
"""

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
    Your are a cosmetic ingredient safety expert.
    Your task is to analyze cosmetic ingredients using
    official cosmetic regulation data.

Tasks:
1. Explain what this ingredient is.
2. Summarize its cosmetic regulations.
3. Mention any concentration limits.
4. Mention warnings in detail and restrictions.
5. Explain whether it appears safe, restricted, or banned you can get it from the metadata.
6. Give a simple user-friendly explanation.

Be concise but informative.
Return the response ONLY in valid JSON format. Do not include any preamble, technical reasoning, or 。
            {format_instructions}
    """,
            ),
            (
                "user",
                """
            Ingredient:
            {item}
            Regulatory Context:
            {context} 
             """,
            ),
        ]
    )
    parser = PydanticOutputParser(pydantic_object=IngredientAnalysis)
    chain = prompt | llm | StrOutputParser()
    
    raw_response = chain.invoke({
        "item":item,
        "context":context,
        "format_instructions": parser.get_format_instructions()
    })

    # Cleanup the response from the LLM
    import re
    # Remove <think> tags and everything inside them (some models like Qwen use this)
    clean_json = re.sub(r"<think>.*?</think>", "", raw_response, flags=re.DOTALL).strip()
    
    # Extract only the JSON object part between the first { and last }
    match = re.search(r"(\{.*\})", clean_json, re.DOTALL)
    if match:
        clean_json = match.group(1)

    # Parse JSON string into Pydantic model
    try:
        parsed_output = parser.parse(clean_json)
    except Exception as e:
        print(f"Failed to parse model output: {clean_json[:100]}...")
        raise e

    return {
        "ingredient": item,
        "retrieval_type": retrieve_type,
        "analysis": parsed_output.model_dump()
    }

# res = analyse_ingredient("Sodium hydroxide")
# print(res["analysis"])
