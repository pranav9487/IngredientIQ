from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router

app = FastAPI(
    title="IngredientIQ API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(
    analyze_router,
    prefix="/api/v1",
    tags=["Analyze"]
)


@app.get("/")
def root():
    return {
        "message": "IngredientIQ API running"
    }


@app.get("/health")
async def health():
    return {
        "status": "ok"
    }