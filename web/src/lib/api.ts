// lib/api.ts

export async function login(): Promise<void> {
  await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function verifySession(): Promise<boolean> {
  const res = await fetch('http://localhost:8000/auth/verify', {
    credentials: 'include',
  });
  return res.ok;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export async function getHistory(): Promise<ChatMessage[]> {
  const res = await fetch('http://localhost:8000/history', {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to load history');
  }

  const raw: ChatMessage[] = await res.json();

  return raw.map((msg) => ({
    ...msg,
    timestamp: msg.timestamp
      ? new Date(msg.timestamp+'Z').toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : undefined,
  }));
}

export async function sendPrompt(prompt: string): Promise<string> {
  const res = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const { detail } = await res.json();
    throw new Error(detail || 'Failed to send prompt');
  }

  const { content } = await res.json();
  return content;
}
