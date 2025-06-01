from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session as DBSession
from app.db import SessionLocal
from app.models import Session, Message
from app.schemas import ChatMessage, ChatRequest, ChatResponse
from app.auth import get_user_id_from_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/history", response_model=list[ChatMessage])
def get_history(db: DBSession = Depends(get_db), user_id: str = Depends(get_user_id_from_token)):
    session = db.query(Session).filter(Session.user_id == user_id).first()
    if not session:
        return []

    messages = db.query(Message).filter(Message.session_id == session.id).order_by(Message.id).all()
    return [
        ChatMessage(
            role=m.role,
            content=m.content,
            timestamp=m.timestamp.isoformat() if m.timestamp else None
        )
        for m in messages
    ]

@router.post("/chat", response_model=ChatMessage)
def chat(req: ChatRequest, db: DBSession = Depends(get_db), user_id: str = Depends(get_user_id_from_token)):
    # Get or create user session
    session = db.query(Session).filter(Session.user_id == user_id).first()
    if not session:
        session = Session(user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)

    # Save user message
    user_msg = Message(session_id=session.id, role="user", content=req.prompt)
    db.add(user_msg)

    # Generate assistant response
    markdown = f"""Here is your response:

**Echo**: {req.prompt}

```chart

{{\"type\": \"bar\", \"data\": {{\"labels\": [\"A\", \"B\"], \"datasets\": [{{\"label\": \"Sample\", \"data\": [1, 2]}}]}}}}\n

```

```chart

{{\"type\": \"line\", \"data\": {{\"labels\": [\"A\", \"B\"], \"datasets\": [{{\"label\": \"Sample\", \"data\": [1, 2]}}]}}}}\n

```
"""
    
    assistant_msg = Message(session_id=session.id, role="assistant", content=markdown)
    db.add(assistant_msg)

    db.commit()

    return ChatMessage(
        role="assistant",
        content=markdown,
        timestamp=assistant_msg.timestamp.isoformat() if assistant_msg.timestamp else None
    )
