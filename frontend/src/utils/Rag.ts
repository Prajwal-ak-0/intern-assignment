import { Message } from "@/types";

export const RAG = async (message: Message)=> {
    const response = await fetch('http://localhost:5000/rag', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return { role: 'BOT', content: data.message };
}