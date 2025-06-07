// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function login(): Promise<void> {
  console.log(`API_BASE in use: ${API_BASE}`);
  await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function verifySession(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/verify`, {
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
  const res = await fetch(`${API_BASE}/history`, {
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
  const res = await fetch(`${API_BASE}/chat`, {
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
