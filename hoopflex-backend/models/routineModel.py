from pydantic import BaseModel, Field
from typing import List, Optional

class Step(BaseModel):
    id: str
    name: str
    sets: int
    reps: int

class Exercise(BaseModel):
    id: str
    name: str
    level: str
    duration: str
    steps: List[Step]
    message: Optional[str] = None

class RoutineInsert(BaseModel):
    idUsuario: Optional[str] = None  # Rutina personalizada
    category: str
    exercise: Exercise
