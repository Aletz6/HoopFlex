from fastapi import FastAPI
from routers import logsRouter
from routers import routinesRouter
from routers import achievementsRouter
from routers import userProfileRouter
from routers import syncRouter

app = FastAPI()
app.include_router(logsRouter.router)
app.include_router(routinesRouter.router)
app.include_router(achievementsRouter.router)
app.include_router(userProfileRouter.router)
app.include_router(syncRouter.router)

@app.get("/")
def home():
    return {"message": "API HoopFlex activa"}
