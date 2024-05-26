// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import ChatContainer from "./components/ChatContainer";
import InputContainer from "./components/InputContainer";
import { Message } from "./types";
import { RAG } from "./utils/Rag"; 
import { SignIn, useUser } from "@clerk/clerk-react";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, isSignedIn } = useUser();

  const createUser = useCallback(async () => {
    const data = {
      clerkId: user?.id,
      username: (user?.firstName + "-" + user?.lastName).replace(/\s+/g, '').toLowerCase(),
      email: user?.primaryEmailAddress?.emailAddress,
    };

    const response = await fetch("http://localhost:8000/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("User created successfully");
    } else {
      const errorData = await response.json();
      console.error("Failed to create user:", errorData);
    }
  }, [user]);

  useEffect(() => {
    if (isSignedIn) {
      createUser();
    }
  }, [isSignedIn, createUser]);

  const handleSend = async (message: string) => {
    const userMessage: Message = { role: "USER", content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await RAG(userMessage);
      console.log(response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="h-screen flex items-center justify-center">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Toaster />
      <Navbar />
      <ChatContainer messages={messages} />
      <InputContainer onSend={handleSend} />
    </div>
  );
};

export default App;