from pydantic import BaseModel
from typing import Optional

class UserProfile(BaseModel):
    idUsuario: str
    nombre: Optional[str] = ""
    edad: Optional[int] = 0
    peso: Optional[float] = 0.0
    talla: Optional[float] = 0.0
    fotoUrl: Optional[str] = ""
