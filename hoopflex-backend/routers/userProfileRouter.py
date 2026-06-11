from fastapi import APIRouter, HTTPException
from dao.userProfileDAO import UserProfileDAO
from models.userProfileModel import UserProfile

router = APIRouter(prefix="/perfil", tags=["Perfil"])

@router.get("/{idUsuario}")
def obtener_perfil(idUsuario: str):
    perfil = UserProfileDAO.obtener_perfil(idUsuario)
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return perfil

@router.put("/{idUsuario}")
def guardar_perfil(idUsuario: str, perfil: UserProfile):
    if idUsuario != perfil.idUsuario:
        raise HTTPException(status_code=400, detail="El ID no coincide")
    return UserProfileDAO.guardar_perfil(perfil)

@router.delete("/{idUsuario}")
def eliminar_perfil(idUsuario: str):
    result = UserProfileDAO.eliminar_perfil(idUsuario)
    if result.deleted_count == 1:
        return {"message": "Perfil eliminado correctamente"}
    raise HTTPException(status_code=404, detail="Perfil no encontrado")
