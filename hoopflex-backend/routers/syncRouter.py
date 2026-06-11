from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from dao.syncDAO import SyncDAO
from models.syncModel import PushSyncRequest

router = APIRouter(prefix="/sync", tags=["Offline Sync"])


@router.post("/push")
def push_sync_batch(request: PushSyncRequest):
    accepted_change_ids = []

    for change in request.changes:
        if change.entityType != "training_log":
            raise HTTPException(status_code=400, detail="Unsupported entity type")

        SyncDAO.apply_training_log_change(request.userId, change)
        accepted_change_ids.append(change.clientChangeId)

    return {
        "acceptedChangeIds": accepted_change_ids,
        "serverTime": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/training-logs")
def pull_training_logs(
    userId: str = Query(...),
    since: datetime | None = Query(default=None),
):
    logs = SyncDAO.list_training_logs_since(userId, since)
    return {
        "logs": logs,
        "serverTime": datetime.now(timezone.utc).isoformat(),
    }
