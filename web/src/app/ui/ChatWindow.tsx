'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import { login, sendPrompt, getHistory, verifySession, ChatMessage } from '@/lib/api';
import dynamic from 'next/dynamic';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), { ssr: false });

const MyChatMessage = memo(function ChatMessage({ content, role, timestamp }: { content: string; role: string; timestamp: string }) {
  return (
    <div
      className={`flex items-start space-x-2 rounded-md p-4 whitespace-pre-wrap ${
        role === 'user' ? 'bg-yellow-100 flex-row-reverse text-right' : 'bg-gray-100 text-left'
      }`}
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 text-xl">{role === 'user' ? '🧑' : '🤖'}</div>
      </div>
      <div className="flex-1">
        <MarkdownRenderer content={content} />
        <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  );
});

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const valid = await verifySession();
        if (!valid) {
          await login();
        }
        const history = await getHistory();
        setMessages(history);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Failed to load chat history:', err.message);
          setError(`Failed to load chat history: ${err.message}`);
        } else {
          console.error('An unknown error occurred:', err);
          setError('An unknown error occurred while loading chat history.');
        }
      }
    }

    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setError(null);
    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    try {
      setMessages(prev => [...prev, { role: 'user', content: input, timestamp }]);
      const response = await sendPrompt(input);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString() }
      ]);
      setInput('');
    } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Failed to get a response:', err.message);
          setError(`Failed to get a response: ${err.message}`);
        } else {
          console.error('An unknown error occurred:', err);
          setError('An unknown error occurred while getting a response.');
        }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = async () => {
    setMessages([]);
    setInput('');
    setError(null);
    await login(); // re-login to start a new session
  };;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <MyChatMessage
            key={idx}
            content={msg.content}
            role={msg.role}
            timestamp={msg.timestamp ? msg.timestamp : new Date().toLocaleTimeString()}
          />
        ))}
        {error && <div className="text-red-500">Error: {error}</div>}
        <div ref={bottomRef} />
      </div>

      <textarea
        className="w-full mt-4 p-2 border rounded-md"
        rows={4}
        placeholder="Write your prompt using Markdown... (Ctrl+Enter to send)"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2 mt-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
