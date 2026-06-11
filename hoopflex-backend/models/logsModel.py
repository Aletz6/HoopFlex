from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class TrainingStep(BaseModel):
    id: str
    name: str
    sets: int
    reps: int

class TrainingLog(BaseModel):
    idUsuario: str
    title: str
    date: datetime
    duration: str
    routineLevel: str
    routineCategory: str
    steps: list[TrainingStep]

