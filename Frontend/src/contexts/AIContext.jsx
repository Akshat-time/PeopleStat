import React, { createContext, useContext, useState } from "react";

const AIContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "/api";

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async (message) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      const json = await res.json();
      
      let aiResponseText = "Sorry, I could not process your request at this time.";
      let detectedEmployees = [];

      if (res.ok && json.success) {
        aiResponseText = json.data.reply;
        if (json.data.detectedEmployees) detectedEmployees = json.data.detectedEmployees;
      } else {
        aiResponseText = json.error || "AI Demo System Failure";
      }

      const newMessage = {
        id: Date.now(),
        type: "ai",
        content: aiResponseText,
        timestamp: new Date(),
        detectedEmployees: detectedEmployees,
      };

      setMessages(prev => [...prev, newMessage]);
      setChatHistory(prev => [...prev, { userMessage: message, aiResponse: newMessage }]);
    } catch (err) {
      console.error("AI Chat Error:", err);
      
      const errorMessage = {
        id: Date.now(),
        type: "ai",
        content: "Error communicating with the AI Server.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <AIContext.Provider value={{ messages, setMessages, isLoading, chatHistory, sendMessage, clearChat }}>
      {children}
    </AIContext.Provider>
  );
};