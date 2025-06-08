# app/routes/auth.py

from fastapi import APIRouter, Security

from app.auth import auth

router = APIRouter()

@router.get("/auth/verify")
def verify(auth_result: str = Security(auth.verify)):
    user_id = auth_result.get("sub")
    if not user_id:
        return {"status": "error", "message": "User ID not found in token"}
    return {"status": "ok", "user_id": user_id}
