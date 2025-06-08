from fastapi import APIRouter, Depends, Security
from sqlalchemy.orm import Session as DBSession
from app.db import SessionLocal
from app.models import Session, Message
from app.schemas import ChatMessage, ChatRequest
from app.auth import auth
import os
from openai import OpenAI
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_history(db: DBSession, user_id: str) -> list[ChatMessage]:
    """Fetch chat history for a given user."""
    session = db.query(Session).filter(Session.user_id == user_id).first()
    if not session:
        return []

    messages = (
        db.query(Message)
        .filter(Message.session_id == session.id)
        .order_by(Message.id)
        .all()
    )
    return [
        ChatMessage(
            role=m.role,
            content=m.content,
            timestamp=m.timestamp.isoformat() if m.timestamp else None,
        )
        for m in messages
    ]


@router.get("/history", response_model=list[ChatMessage])
def get_history(
    db: DBSession = Depends(get_db), 
    auth_result: str = Security(auth.verify)
):
    user_id = auth_result.get("sub")
    logger.info(f"Fetching chat history for user_id: {user_id}")
    return _get_history(db, user_id)


def prompt_llm_markdown(prompt: str) -> str:
    # Prompt the LLM using openai using the key in the .env file

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1", 
        api_key=os.getenv("OPENROUTER_KEY")
    )
    if not client.api_key:
        raise RuntimeError("OPENROUTER_KEY not set in environment variables.")

    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://kazkazi.de/chat/",  # Optional. Site URL for rankings on openrouter.ai.
                "X-Title": "Kazkazi - Chat",  # Optional. Site title for rankings on openrouter.ai.
            },
            extra_body={},
            model="google/gemini-2.5-flash-preview-05-20",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        )
        logger.info(f"LLM response: {completion.choices[0].message.content[0:100]}...")  # Log first 100 chars of response
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error communicating with LLM: {str(e)}"

def prepare_prompt(prompt:str, history: list[ChatMessage]) -> str:
    return f"""
You are a helpful assistant. Please respond to the user's query.
User's query: {prompt}
Chat history:
{''.join([f"{msg.role}: {msg.content}\n" for msg in history])}

If you are unsre about the answer, please ask the user for clarification.

You can provide charts inline using the code element with the language set to "chart". The content needs to be valid JSON that will be rendered with chart.js. There is no need to explain the chart.js code. Don't use any callbacks or other functions, just return the JSON data.

Show the data in a table if it is relevant to the user's query.
"""



@router.post("/chat", response_model=ChatMessage)
def chat(
    req: ChatRequest,
    db: DBSession = Depends(get_db),
    auth_result: str = Security(auth.verify)
):
    user_id = auth_result.get("sub")
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

    history = _get_history(db, user_id)

    # Generate assistant response
    markdown = prompt_llm_markdown(
        prepare_prompt(req.prompt, history)
    )  # Assuming this function exists to convert prompt to markdown
    if not markdown:
        markdown = "No response generated. Please try again."

    assistant_msg = Message(session_id=session.id, role="assistant", content=markdown)
    db.add(assistant_msg)

    db.commit()

    return ChatMessage(
        role="assistant",
        content=markdown,
        timestamp=assistant_msg.timestamp.isoformat()
        if assistant_msg.timestamp
        else None,
    )
