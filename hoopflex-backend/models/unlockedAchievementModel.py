from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UnlockedAchievement(BaseModel):
    idUsuario: str
    idLogro: str
    unlockedAt: Optional[str] = Field(default_factory=lambda: datetime.now().isoformat())
