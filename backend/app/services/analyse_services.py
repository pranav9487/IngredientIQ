from langchain_community.document_loaders import WebBaseLoader
import bs4
import re
from . import extractor
async def analyze_product(url: str):
    # print(f"Analyzing product at URL: {url}")
    loader = WebBaseLoader(web_path=url)
    docs =loader.load()
    
    full_text = " ".join([doc.page_content for doc in docs])
    stop_words = r"\n\n|Directions:|How to use:|Product description|Warnings:|Safety Information:|Key Benefits:|$"
    ingredients_pattern = rf"(?i)ingredients:\s*(.*?)(?={stop_words})"
    match = re.search(ingredients_pattern, full_text, re.DOTALL)
    if match:
        extracted_ingredients = match.group(1).strip()
    else:
        extracted_ingredients = "Ingredients not found"
    # print(f"Extracted Ingredients: {extracted_ingredients}")
    ingredients_list = extractor.extract_ingredients(extracted_ingredients)
    print(f"Final Ingredients List: {ingredients_list}")
    return {
        "success": True,
        "ingredients_list": ingredients_list,
        "message": "Analyze service working",
        "received_url": url
    }