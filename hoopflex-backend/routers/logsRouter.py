from fastapi import APIRouter, HTTPException
from models.logsModel import TrainingLog
from dao.logsDAO import LogsDAO
from bson.errors import InvalidId
from logic.achievementUnlocker import AchievementUnlocker
from datetime import datetime, timezone

router = APIRouter(prefix="/logs", tags=["Training Logs"])

@router.post("/")
def agregar_log(log: TrainingLog):
    # Guardar el log
    result = LogsDAO.agregar_log(log, updated_at=datetime.now(timezone.utc))

    # Intentar desbloquear logros automáticamente
    try:
        AchievementUnlocker.check_and_unlock(log.idUsuario)
    except Exception as e:
        print(f"Error al revisar logros: {e}")  # Evita que esto frene la respuesta de la API

    return {"inserted_id": str(result.inserted_id)}

@router.get("/{idUsuario}")
def obtener_logs(idUsuario: str):
    logs = LogsDAO.obtener_logs_usuario(idUsuario)
    return logs

@router.delete("/{idLog}")
def eliminar_log(idLog: str):
    try:
        result = LogsDAO.eliminar_log(idLog)
    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido para eliminación")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log no encontrado")
    return {"deleted": True}
