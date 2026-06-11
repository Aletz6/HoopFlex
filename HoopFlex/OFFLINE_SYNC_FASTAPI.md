# Offline sync contract

The mobile app now calls these authenticated FastAPI endpoints:

## `POST /sync/push`

Request:

```json
{
  "userId": "firebase-uid",
  "changes": [
    {
      "clientChangeId": "outbox_123",
      "entityType": "training_log",
      "entityId": "log_123",
      "operation": "upsert",
      "payload": {
        "id": "log_123",
        "localId": "log_123",
        "idUsuario": "firebase-uid",
        "title": "Routine",
        "date": "2026-05-12T18:00:00.000Z",
        "duration": "10:35",
        "routineLevel": "Beginner",
        "routineCategory": "Shooting",
        "steps": []
      },
      "createdAt": "2026-05-12T18:00:00.000Z"
    }
  ]
}
```

Recommended response:

```json
{
  "acceptedChangeIds": ["outbox_123"],
  "serverTime": "2026-05-12T18:00:03.000Z"
}
```

For `operation = "delete"`, use `entityId` to delete or soft-delete the server record.

## `GET /sync/training-logs`

Query params:

- `userId`
- `since` optional ISO timestamp

Recommended response:

```json
{
  "logs": [
    {
      "id": "server-or-client-id",
      "idUsuario": "firebase-uid",
      "title": "Routine",
      "date": "2026-05-12T18:00:00.000Z",
      "duration": "10:35",
      "routineLevel": "Beginner",
      "routineCategory": "Shooting",
      "steps": [],
      "updated_at": "2026-05-12T18:00:03.000Z"
    }
  ],
  "serverTime": "2026-05-12T18:00:03.000Z"
}
```

## Backend notes

- Verify the Firebase bearer token before trusting `userId`.
- Prefer idempotent processing keyed by `clientChangeId`.
- Preserve `entityId` or `localId` so retries do not create duplicate logs.
- Returning only records changed after `since` keeps pulls incremental.
