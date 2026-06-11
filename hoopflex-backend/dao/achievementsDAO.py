from config import collection_achievements, collection_unlocked
from bson import ObjectId

class AchievementsDAO:
    @staticmethod
    def get_all():
        return list(collection_achievements.find({}))

    @staticmethod
    def get_user_unlocked(user_id: str):
        return list(collection_unlocked.find({"idUsuario": user_id}))

    @staticmethod
    def format_achievements(all_achievements, unlocked):
        unlocked_ids = {str(u["idLogro"]) for u in unlocked}
        formatted = []
        for logro in all_achievements:
            formatted.append({
                "id": str(logro["_id"]),
                "title": logro["title"],
                "description": logro["description"],
                "category": logro["category"],
                "unlocked": str(logro["_id"]) in unlocked_ids
            })
        return formatted
