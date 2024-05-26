import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const InputContainer: React.FC = () => {
  const { user } = useUser();
  const [input, setInput] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    if (input.trim()) {
      // Send a POST request to the backend
      fetch(`http://localhost:8000/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clerkId: user?.id ?? "", query: input, results:"" }),
      })
        .then((response) => {
          console.log("Response:", response);
          return response.json();
        })
        .then((data) => {
          console.log("Data:", data);
        });

      setInput("");
    }
  };

  return (
    <div className="relative flex p-2 mx-36 my-6 rounded-xl border-t bg-[#E4E8EE]  border-gray-300">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="flex items-center justify-center mx-auto  h-12 my-1 md:px-8 px-6 w-full text-black  rounded-full focus:outline-none  py-1 text-md bg-transparent  file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground placeholder:pl-1 placeholder:font-normal placeholder:text-lg disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        className="ml-4 px-8 py-2  text-black rounded-md"
      >
        <SendHorizontal />
      </button>
    </div>
  );
};

export default InputContainer;
