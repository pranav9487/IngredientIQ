from pydantic import BaseModel, Field
from typing import List

class ConcentrationLimit(BaseModel):
    product_type: str = Field(description="The type of cosmetic product")
    max_threshold: str = Field(description="The maximum allowed concentration or threshold")


class RegulationStatus(BaseModel):
    status: str = Field(description="Regulatory status e.g., Restricted, Banned, Safe")
    annex: str = Field(description="The relevant Annex from cosmetic regulations")


class AnalysisSummary(BaseModel):
    technical: str = Field(description="Detailed technical explanation for experts")
    simple_explanation: str = Field(description="Easy to understand explanation for consumers")


class IngredientAnalysis(BaseModel):
    ingredient_name: str
    regulation_status: RegulationStatus
    concentration_limits: List[ConcentrationLimit]
    warnings: List[str]= Field(description="warnings associated with the ingredient as a list of strings")
    summary: AnalysisSummary


class AnalyzeRequest(BaseModel):
    url: str
    test:int