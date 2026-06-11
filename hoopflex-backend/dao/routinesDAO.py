from config import collection_routines
from models.routineModel import RoutineInsert
from bson import ObjectId

class RoutinesDAO:
    @staticmethod
    def guardar_rutina(rutina):
        print("🧪 Guardando rutina:", rutina.dict())
        result = collection_routines.insert_one(rutina.dict())
        print("✅ Insertado:", result.inserted_id)
        return result

    @staticmethod
    def obtener_todas():
        rutinas = list(collection_routines.find())
        # Convierte _id a string
        for rutina in rutinas:
            rutina["_id"] = str(rutina["_id"])
        return rutinas

    @staticmethod
    def obtener_por_usuario(idUsuario: str):
        rutinas = list(collection_routines.find({"idUsuario": idUsuario}))
        for rutina in rutinas:
            rutina["_id"] = str(rutina["_id"])
        return rutinas

    @staticmethod
    def eliminar(id: str):
        return collection_routines.delete_one({"_id": ObjectId(id)})
