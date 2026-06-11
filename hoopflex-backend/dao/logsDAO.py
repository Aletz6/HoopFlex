from config import collection_logs
from models.logsModel import TrainingLog
from bson import ObjectId

class LogsDAO:
    @staticmethod
    def agregar_log(log: TrainingLog, updated_at=None):
        payload = log.dict()
        if updated_at is not None:
            payload["updated_at"] = updated_at
        return collection_logs.insert_one(payload)

    @staticmethod
    def obtener_logs_usuario(idUsuario: str):
        logs = list(collection_logs.find({"idUsuario": idUsuario}))
        # Convertir el ObjectId en cada log a str
        for log in logs:
            log["_id"] = str(log["_id"])
        return logs

    @staticmethod
    def eliminar_log(idLog: str):
        return collection_logs.delete_one({"_id": ObjectId(idLog)})
