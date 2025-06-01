from pydantic import BaseModel
from typing import Optional, Literal

class ChatRequest(BaseModel):
    prompt: str

class ChatMessage(BaseModel):
    role: Literal['user', 'assistant']
    content: str
    timestamp: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    error: Optional[str] = None
