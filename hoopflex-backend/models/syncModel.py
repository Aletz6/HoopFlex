from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel


class SyncChange(BaseModel):
    clientChangeId: str
    entityType: Literal["training_log"]
    entityId: str
    operation: Literal["upsert", "delete"]
    payload: dict[str, Any]
    createdAt: datetime


class PushSyncRequest(BaseModel):
    userId: str
    changes: list[SyncChange]
