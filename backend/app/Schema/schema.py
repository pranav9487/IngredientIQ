from pydantic import BaseModel, Field
from typing import List


class AnalyzeRequest(BaseModel):
    url: str = Field(description="Product URL to analyze")

class ConcentrationLimit(BaseModel):
    product_type:str =Field(description="the type of the cosmetic product")
    max_threshold: str = Field(description="The maximum allowed concentration or threshold")

class RegulationStatus(BaseModel):
    status: str= Field(description="Regulatory status e.g., Restricted, Banned, Safe")
    annex_type:str= Field(description="type of the annex ")
class AnalysisSummary(BaseModel):
    technical: str = Field(description="Detailed technical explanation for experts")
    simple_explanation: str = Field(description="Easy to understand explanation for consumers")

class IngredientAnalysis(BaseModel):
    ingredient_name:str
    regulation_status:RegulationStatus
    concentration_limits: List[ConcentrationLimit]
    warnings: List[str]= Field(description="warnings associated with the ingredient")
    isSafe:bool= Field(description="Overall safety status based on analysis results")
    summary: AnalysisSummary