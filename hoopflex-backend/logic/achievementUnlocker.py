from datetime import datetime
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["hoopflex"]
collection_logs = db["trainingLogs"]
collection_achievements = db["achievements"]
collection_unlocked = db["unlockedAchievements"]

class AchievementUnlocker:

    @staticmethod
    def check_and_unlock(user_id: str):
        print(f"🚀 Ejecutando check_and_unlock para el usuario {user_id}")

        logs = list(collection_logs.find({"idUsuario": user_id}))
        unlocked = list(collection_unlocked.find({"idUsuario": user_id}))
        unlocked_ids = {str(u["idLogro"]) for u in unlocked}
        now = datetime.now()

        logs_today = [
            l for l in logs
            if isinstance(l["date"], datetime) and l["date"].date() == now.date()
        ]

        def unlock(logro):
            if logro and str(logro["_id"]) not in unlocked_ids:
                print(f"🏆 Desbloqueado: {logro['title']}")
                collection_unlocked.insert_one({
                    "idUsuario": user_id,
                    "idLogro": logro["_id"],
                    "unlockedAt": datetime.now().isoformat()
                })

        def lock(logro):
            if logro and str(logro["_id"]) in unlocked_ids:
                print(f"🔒 Re-bloqueado: {logro['title']}")
                collection_unlocked.delete_many({
                    "idUsuario": user_id,
                    "idLogro": logro["_id"]
                })

        def is_unlocked(logro):
            return logro and str(logro["_id"]) in unlocked_ids

        for category in ["Dribble", "Shooting", "Agility"]:
            logs_cat = [l for l in logs if l.get("routineCategory") == category]

            # Revisión de cada logro por categoría
            checks = {
                f"{category.lower()}_first_training": bool(logs_cat),
                f"{category.lower()}_advanced_training": any(l.get("routineLevel") == "Advanced" for l in logs_cat),
                f"{category.lower()}_3_day_streak": AchievementUnlocker.has_consecutive_days(logs_cat, 3),
                f"{category.lower()}_10_day_streak": AchievementUnlocker.has_consecutive_days(logs_cat, 10),
                f"{category.lower()}_double_training": sum(1 for l in logs_cat if isinstance(l["date"], datetime) and l["date"].date() == now.date()) >= 2,
                f"{category.lower()}_1_hour": AchievementUnlocker.total_minutes(logs_cat) >= 60,
                f"{category.lower()}_early_training": any(isinstance(l["date"], datetime) and l["date"].hour < 7 for l in logs_cat)
            }

            for key, condition in checks.items():
                logro = AchievementUnlocker.get_achievement_by_key(key)
                (unlock if condition else lock)(logro)

            # Si todos los anteriores están desbloqueados, desbloquea el de "all_unlocked"
            all_keys = list(checks.keys())
            if all(is_unlocked(AchievementUnlocker.get_achievement_by_key(k)) for k in all_keys):
                unlock(AchievementUnlocker.get_achievement_by_key(f"{category.lower()}_all_unlocked"))
            else:
                lock(AchievementUnlocker.get_achievement_by_key(f"{category.lower()}_all_unlocked"))

        # Logros Generales
        general_checks = {
            "general_3_day_streak": AchievementUnlocker.has_consecutive_days(logs, 3),
            "general_10_day_streak": AchievementUnlocker.has_consecutive_days(logs, 10),
            "general_early_training": any(isinstance(l["date"], datetime) and l["date"].hour < 7 for l in logs),
            "general_all_dribble_shooting_agility": {"Dribble", "Shooting", "Agility"}.issubset({l.get("routineCategory") for l in logs})
        }

        for key, condition in general_checks.items():
            logro = AchievementUnlocker.get_achievement_by_key(key)
            (unlock if condition else lock)(logro)

        # Todos los logros desbloqueados
        all_keys = [a["key"] for a in collection_achievements.find()]
        if all(is_unlocked(AchievementUnlocker.get_achievement_by_key(k)) for k in all_keys):
            unlock(AchievementUnlocker.get_achievement_by_key("general_all_achievements"))
        else:
            lock(AchievementUnlocker.get_achievement_by_key("general_all_achievements"))

    @staticmethod
    def has_consecutive_days(logs, min_days):
        try:
            dates = sorted(set(l["date"].date() for l in logs if isinstance(l["date"], datetime)))
        except Exception as e:
            print("❌ Error al parsear fechas:", e)
            return False

        if len(dates) < min_days:
            return False

        count = 1
        for i in range(1, len(dates)):
            if (dates[i] - dates[i - 1]).days == 1:
                count += 1
                if count >= min_days:
                    return True
            else:
                count = 1
        return False

    @staticmethod
    def total_minutes(logs):
        total = 0
        for l in logs:
            try:
                mins = int(l["duration"].split(":")[0])
                total += mins
            except Exception as e:
                print("❌ Error leyendo duración:", e)
        return total

    @staticmethod
    def get_achievement_by_key(key: str):
        return collection_achievements.find_one({"key": key})
