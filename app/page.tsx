"use client";
import Image from "next/image";
import { useState, ChangeEvent, KeyboardEvent } from "react";
type ChatMessage = {
  content: string;
  role: "user" | "support";
};
export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "support",
      content:
        "Hey, do you have the contact details for Jane Doe? We need to update our records.",
    },
    {
      role: "user",
      content:
        "Yes, I do. You can contact Jane Doe at jane.doe@email.com or reach her at 555-123-4567.",
    },
    {
      role: "support",
      content:
        "Great, thanks! Do we also have her Social Security Number and credit card information?",
    },
    {
      role: "user",
      content:
        "Yes, her SSN is 123-45-6789. As for the credit card, it's 1234-5678-9012-3456.",
    },
    {
      role: "support",
      content:
        "Perfect. What about her passport and driver's license numbers? We'll need those for the identification verification process.",
    },
    {
      role: "user",
      content:
        "Her passport number is AB1234567, and the driver's license is X1234567.",
    },
    { role: "support", content: "Got it. And her address?" },
    {
      role: "user",
      content:
        "It's 123 Main St. Also, make sure to update her date of birth and bank account number.",
    },
    {
      role: "support",
      content: "Sure, what's her date of birth and bank account number?",
    },
    {
      role: "user",
      content:
        "Her date of birth is 1990-01-01, and the bank account number is 12345678901234567.",
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { content: newMessage, role: "user" }]);
      setNewMessage("");
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const postChatHistory = async () => {
    try {
      const response = await fetch("/api/masking/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assuming the stream sends data as text
      const reader = response.body?.getReader();
      let receivedData = "";

      // Process the stream
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Assuming the stream is sending text data
          const textChunk = new TextDecoder().decode(value);
          receivedData += textChunk;
        }

        // Assuming the complete data is a single string message
        setMessages([...messages, { content: receivedData, role: "user" }]);
      }
    } catch (error) {
      console.error("Failed to send chat history:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col h-screen max-w-sm">
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col mb-4 gap-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-blue-500 text-white"
                  } rounded-lg px-4 py-2 max-w-[80%]`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center h-16">
          <input
            type="text"
            className="border text-black border-gray-300 rounded-lg py-2 px-4 w-full max-w-lg mr-4"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>

        <button
          className="bg-green-500 py-2 px-4 my-4 rounded-2xl"
          onClick={postChatHistory}
        >
          Send Chat History
        </button>
      </div>
    </main>
  );
}
