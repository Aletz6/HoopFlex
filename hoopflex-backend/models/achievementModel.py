from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Achievement(BaseModel):
    title: str
    description: str
    category: str

class AchievementInDB(Achievement):
    id: Optional[str] = Field(default=None, alias="_id")
