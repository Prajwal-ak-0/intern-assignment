// src/components/ChatContainer.tsx
import React, { useRef, useLayoutEffect } from 'react';
import { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current && lastMessageRef.current) {
      const messagesContainer = messagesContainerRef.current;
      const lastMessage = lastMessageRef.current;
      const offset = lastMessage.offsetTop - messagesContainer.offsetTop;
      messagesContainer.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
      {messages.map((message, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`p-4 w-full flex items-start gap-x-4 rounded-lg ${
            message.role === 'USER' ? 'bg-emerald-50 border border-black/10' : 'bg-purple-100'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
