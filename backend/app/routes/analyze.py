import asyncio
from fastapi import APIRouter

from app.Schema.schema import AnalyzeRequest
from app.services.analyse_services import analyze_product
from app.services.pubchem import (
    get_compound_cid,
    get_compound_properties,
    get_compound_hazards,
)
from app.data.ingredient_aliases import INGREDIENT_ALIASES
from app.services.agent import analyse_ingredient
from app.db.database import get_database
router = APIRouter()
db= get_database()
def normalize_ingredient_name(name: str):
    original= name.strip()
    clean = original.lower()
    if clean in INGREDIENT_ALIASES:
        normalized=  INGREDIENT_ALIASES[clean]
    else :
        normalized = original
    return {
        "original_name":original,
        "normalized_name": normalized
    }
    
INGREDIENTS_COLLECTION = "ingredients"

@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    # result = await analyze_product(request.url)

    # ingredients = result.get("ingredients_list") or []
    ingredients = [
        # "Cocamide Mea",
        # "Sodium Xylenesulfonate",
        # "Zinc Carbonate",
        # "Glycol Distearate",
        # "Sodium Lauryl Sulfate"
        "trimethylammonium hydroxide"
    ]
    analysis_results = []

    for ingredient in ingredients:
        cached = db[INGREDIENTS_COLLECTION].find_one(
            {"ingredient": {"$regex": f"^{ingredient}$", "$options": "i"}}
        )

        if cached:
            # Cache HIT: use stored data, skip the full pipeline
            print(f"[CACHE HIT] '{ingredient}' found in DB.")
            cached.pop("_id", None)  # Remove MongoDB internal _id before returning
            analysis_results.append(cached)
            continue  # Skip to next ingredient (no API calls needed)

        # --- Step 2: Cache MISS — run full PubChem + RAG pipeline ---
        print(f"[CACHE MISS] '{ingredient}' not in DB. Running full analysis...")

        aliases = [s.strip() for s in ingredient.split("/") if s.strip()]
        cid = None
        for name in aliases:
            cid = await get_compound_cid(name)
            if cid:
                break

        if not cid:
            properties = None
            hazards = None
        else:
            properties = await get_compound_properties(cid)
            hazards = await get_compound_hazards(cid)

        rag_data = analyse_ingredient(ingredient)

        result = {
            "ingredient": ingredient,
            "cid": cid,
            "properties": properties,
            "hazards": hazards,
            "regulatory_analysis": rag_data["analysis"],
            "retriver_type": rag_data["retrieval_type"],
        }

        # --- Step 3: Save new result to MongoDB for future cache hits ---
        try:
            db[INGREDIENTS_COLLECTION].insert_one(result.copy())
            print(f"[DB SAVED] '{ingredient}' saved to MongoDB.")
        except Exception as e:
            print(f"[DB ERROR] Failed to save '{ingredient}' to DB: {e}")

        analysis_results.append(result)
        await asyncio.sleep(5)  # Rate-limit PubChem API calls

    return {
        # until you add product_name in analyze_product, this fallback prevents KeyError
        # "product_name": result.get("product_name") or result.get("received_url"),
        "ingredients": analysis_results,
    }