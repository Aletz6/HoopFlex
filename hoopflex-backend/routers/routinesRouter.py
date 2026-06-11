from fastapi import APIRouter, HTTPException
from dao.routinesDAO import RoutinesDAO
from models.routineModel import RoutineInsert

router = APIRouter(prefix="/routines", tags=["Routines"])

@router.post("/")
def guardar_rutina(rutina: RoutineInsert):
    print("🔁 PASANDO POR ROUTER")
    result = RoutinesDAO.guardar_rutina(rutina)
    return {"inserted_id": str(result.inserted_id)}


@router.get("/")
def obtener_todas():
    return RoutinesDAO.obtener_todas()

@router.get("/{idUsuario}")
def obtener_por_usuario(idUsuario: str):
    rutinas = RoutinesDAO.obtener_por_usuario(idUsuario)
    if not rutinas:
        raise HTTPException(status_code=404, detail="No se encontraron rutinas para este usuario.")
    return rutinas

@router.delete("/{id}")
def eliminar_rutina(id: str):
    result = RoutinesDAO.eliminar(id)
    if result.deleted_count == 1:
        return {"message": "Rutina eliminada correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")