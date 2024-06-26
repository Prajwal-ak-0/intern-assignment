// src/App.tsx
import React, { useEffect, useCallback } from "react";
import ChatContainer from "./components/ChatContainer";
import { SignIn, useUser } from "@clerk/clerk-react";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const { user, isSignedIn } = useUser();

  const createUser = useCallback(async () => {
    const data = {
      clerkId: user?.id,
      username: (user?.firstName + "-" + user?.lastName).replace(/\s+/g, '').toLowerCase(),
      email: user?.primaryEmailAddress?.emailAddress,
    };

    const response = await fetch("https://backend-1-e98u.onrender.com/api/users/", {
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
      <ChatContainer/>
    </div>
  );
};

export default App;