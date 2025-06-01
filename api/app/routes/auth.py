# app/routes/auth.py

from datetime import timedelta
from uuid import uuid4

from fastapi import APIRouter, Response, Depends

from app.auth import create_access_token, get_user_id_from_token

router = APIRouter()

@router.get("/auth/verify")
def verify(user_id: str = Depends(get_user_id_from_token)):
    return {"status": "ok", "user_id": user_id}


@router.post("/auth/login")
def login(response: Response):
    user_id = str(uuid4())
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=timedelta(days=7)
    )

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production
        samesite="Lax",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

    return {"message": "Login successful", "user_id": user_id}
