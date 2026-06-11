from datetime import datetime, timezone

from bson import ObjectId

from config import collection_logs, collection_sync_changes
from models.syncModel import SyncChange


class SyncDAO:
    @staticmethod
    def apply_training_log_change(user_id: str, change: SyncChange) -> bool:
        already_processed = collection_sync_changes.find_one(
            {"clientChangeId": change.clientChangeId}
        )
        if already_processed:
            return False

        now = datetime.now(timezone.utc)

        if change.operation == "delete":
            SyncDAO._delete_training_log(user_id, change.entityId)
        else:
            payload = dict(change.payload)
            payload["idUsuario"] = user_id
            payload["clientEntityId"] = change.entityId
            payload["updated_at"] = now
            payload.pop("_id", None)

            collection_logs.update_one(
                {
                    "idUsuario": user_id,
                    "clientEntityId": change.entityId,
                },
                {
                    "$set": payload,
                    "$setOnInsert": {"created_at": now},
                },
                upsert=True,
            )

        collection_sync_changes.insert_one(
            {
                "clientChangeId": change.clientChangeId,
                "userId": user_id,
                "entityType": change.entityType,
                "entityId": change.entityId,
                "operation": change.operation,
                "processedAt": now,
            }
        )
        return True

    @staticmethod
    def list_training_logs_since(user_id: str, since: datetime | None):
        query = {"idUsuario": user_id}
        if since is not None:
            query["updated_at"] = {"$gt": since}

        logs = list(collection_logs.find(query).sort("updated_at", 1))
        for log in logs:
            log["id"] = log.get("clientEntityId") or str(log.get("_id"))
            log["_id"] = str(log["_id"])
        return logs

    @staticmethod
    def _delete_training_log(user_id: str, entity_id: str):
        result = collection_logs.delete_one(
            {
                "idUsuario": user_id,
                "clientEntityId": entity_id,
            }
        )
        if result.deleted_count:
            return

        if ObjectId.is_valid(entity_id):
            collection_logs.delete_one(
                {
                    "_id": ObjectId(entity_id),
                    "idUsuario": user_id,
                }
            )
