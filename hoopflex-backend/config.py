from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["hoopflex"]

collection_logs = db["trainingLogs"]
collection_sync_changes = db["syncChanges"]
collection_routines = db["rutinas"]
collection_achievements = db["achievements"]
collection_unlocked = db["unlockedAchievements"]
collection_profiles = db["userProfiles"]
