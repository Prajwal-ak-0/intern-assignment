// src/App.tsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatContainer from './components/ChatContainer';
import InputContainer from './components/InputContainer';
import { Message } from './types';
import { RAG } from './utils/Rag'; // Adjust import as necessary
import { GetHistory } from './utils/GetHistory'; // Adjust import as necessary
import { SignIn, useSession } from '@clerk/clerk-react';


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (message: string) => {
    const userMessage: Message = { role: 'USER', content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await RAG(userMessage);
      console.log(response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getHistory = async () => {
    try {
      const history = await GetHistory();
      if (Array.isArray(history)) {
        const updatedHistory: Message[] = history.map((message) => ({
          role: message.sender,
          content: message.message,
        }));
        setMessages(updatedHistory);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };
  
  const user = useSession();

  useEffect(() => {
    getHistory();
  }, []);

  if(!user.isSignedIn){
    return <div className='h-screen flex items-center justify-center'><SignIn/></div>
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <ChatContainer messages={messages} />
      <InputContainer onSend={handleSend} />
    </div>
  );
};

export default App;