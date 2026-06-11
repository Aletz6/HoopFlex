from fastapi import APIRouter, HTTPException
from dao.achievementsDAO import AchievementsDAO
from logic.achievementUnlocker import AchievementUnlocker

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("/{idUsuario}")
def obtener_logros(idUsuario: str):
    try:
        AchievementUnlocker.check_and_unlock(idUsuario)
        all_achievements = AchievementsDAO.get_all()
        unlocked = AchievementsDAO.get_user_unlocked(idUsuario)
        return AchievementsDAO.format_achievements(all_achievements, unlocked)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

