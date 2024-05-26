import React, { useRef, useLayoutEffect, useState } from 'react';
import { SendHorizontal } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export type Message = {
  role: "USER" | "BOT";
  content: string;
};

const ChatApp: React.FC = () => {
  const { user } = useUser();
  const [input, setInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  }, [chatMessages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: 'USER', content: input.trim() };
      setChatMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        // Send a POST request to the backend
        const response = await fetch(`https://backend-1-e98u.onrender.com/api/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkId: user?.id ?? "", query: input.trim(), results: "" }),
        });
        const data = await response.json();

        // Add bot response to messages
        if (data.results) {
          const botMessage: Message = { role: 'BOT', content: data.results };
          setChatMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } catch (error) {
        console.error("Error fetching bot response:", error);
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="loader text-xl">Loading...</div>
        </div>
      )}
      <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
        {chatMessages.map((message, index) => (
          <div
            key={index}
            ref={index === chatMessages.length - 1 ? lastMessageRef : null}
            className={`flex items-start gap-x-4 mb-4 p-4 md:mx-28 ${
              message.role === 'USER' ? ' bg-emerald-50 border border-black/10' : 'bg-purple-100'
            } rounded-lg`}
          >
            <img
              src={message.role === 'USER' ? '/user.png' : '/bot.png'}
              alt={message.role === 'USER' ? 'User' : 'Bot'}
              className="w-10 h-10 rounded-full"
            />
            <p className="text-md font-normal">{message.content}</p>
          </div>
        ))}
      </div>
      <div className="relative flex p-2 mx-36 my-6 rounded-xl border-t bg-[#E4E8EE]  border-gray-300">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex items-center justify-center mx-auto h-12 my-1 md:px-8 px-6 w-full text-black rounded-full focus:outline-none py-1 text-md bg-transparent file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground placeholder:pl-1 placeholder:font-normal placeholder:text-lg disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          type="submit"
          className="ml-4 px-8 py-2 text-black rounded-md"
        >
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
