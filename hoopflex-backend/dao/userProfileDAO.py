from config import collection_profiles
from models.userProfileModel import UserProfile

class UserProfileDAO:
    @staticmethod
    def obtener_perfil(idUsuario: str):
        perfil = collection_profiles.find_one({"idUsuario": idUsuario})
        if perfil:
            perfil["_id"] = str(perfil["_id"])
        return perfil

    @staticmethod
    def guardar_perfil(perfil: UserProfile):
        result = collection_profiles.update_one(
            {"idUsuario": perfil.idUsuario},
            {"$set": perfil.dict()},
            upsert=True
        )
        return {"message": "Perfil guardado correctamente"}

    @staticmethod
    def eliminar_perfil(idUsuario: str):
        return collection_profiles.delete_one({"idUsuario": idUsuario})
