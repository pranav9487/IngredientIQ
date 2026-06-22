## use of the prefix and tags in router
 Why use it: It helps with versioning and grouping.
Example: If you have a route defined as @router.post("/analyze") in analyze.py, the actual URL becomes http://localhost:8000/api/v1/analyze.

The tags argument is used for grouping routes in the automatically generated interactive API documentation (Swagger UI).
Why use it: It improves discoverability and readability.
Example: When you visit /docs (e.g., http://localhost:8000/docs), all endpoints from this router will be grouped under a bold heading named Analyze.

## why is __init__ is used 
 __init__.py is used to tell Python:
“This folder should be treated as a Python package/module.”
Without it, Python may not properly recognize the folder for imports.Python needs to know:
app is importable
routes is importable
That’s what __init__.py does

## why csv files are used over the pdf
CSV Advantages

With CSV:

✅ direct row access
✅ pandas support
✅ structured metadata
✅ easier filtering
✅ easier debugging
✅ easier chunking
✅ cleaner embeddings
✅ easier evaluator integration

PDF Problems

With PDF you must:

❌ extract tables
❌ clean OCR noise
❌ remove headers
❌ remove page numbers
❌ fix broken lines
❌ repair chunk boundaries
## to run the backend server
  uvicorn app.main:app --reload
### for uv package 
    .venv\Scripts\activate

### "analysis": response.model_dump() what is model.dump
model_dump() is a Pydantic method that converts a Pydantic object into a normal Python dictionary.

Right now your response is NOT a plain dict.

It is a Pydantic model object like:

IngredientAnalysis(
    ingredient_name='Sodium hydroxide',
    regulation_status=RegulationStatus(...),
    concentration_limits=[...]
)

## what is use od the uvicorn in this project 
uvicorn is the ASGI web server that actually runs your FastAPI backend and serves your API endpoints over HTTP.

In this project:

Your FastAPI app object is created in main.py (it’s the app variable).
When you run the command shown in notes.md:
uvicorn app.main:app --reload
app.main:app means: import the module app/main.py (app.main) and grab the FastAPI instance named app.