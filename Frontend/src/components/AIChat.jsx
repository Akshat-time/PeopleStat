import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import EmployeeProfileCard from "@/components/EmployeeProfileCard";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Brain,
  Loader2,
  Minimize2,
  Maximize2
} from "lucide-react";
import { useAI } from "@/contexts/AIContext";

const AIChat = ({ isFloating = false, isOpen = true, onToggle }) => {
  const { messages, sendMessage, isLoading, clearChat } = useAI();
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to render employee data as text for floating chat
  const renderEmployeeAsText = (employee) => {
    return `${employee.name} (${employee.role}) – Fitment ${employee.fitment}%, Fatigue ${employee.fatigue}%, ${employee.risk} Risk`;
  };

  // Helper function to render message content based on mode
  const renderMessageContent = (message) => {
    if (isFloating) {
      // Text-only mode for floating chat
      let textContent = message.content;

      if (message.detectedEmployees && message.detectedEmployees.length > 0) {
        const employeeTexts = message.detectedEmployees.map(renderEmployeeAsText);
        textContent += "\n\n" + employeeTexts.join("\n");
      }

      return (
        <div className="text-sm whitespace-pre-wrap">{textContent}</div>
      );
    } else {
      // Rich UI mode for full page
      return (
        <div className="w-full max-w-full overflow-y-auto space-y-4">
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Employee Profile Cards */}
          {message.type === "ai" && message.detectedEmployees && message.detectedEmployees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {message.detectedEmployees.map((employee, index) => (
                <EmployeeProfileCard key={index} employee={employee} />
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message immediately
    messages.push(userMessage);
    setInputMessage("");

    // Send to AI
    await sendMessage(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Who is at burnout risk?",
    "Who should be reskilled?",
    "Who is underutilized?",
    "Show me high-risk employees",
    "Who are our top performers?",
    "Tell me about Sarah Johnson",
    "What about Michael Chen?"
  ];

  if (isFloating) {
    return (
      <>
        {/* Floating Button */}
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={onToggle}
              className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Brain className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">AI Workforce Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <div className="text-center text-gray-500 text-sm mb-4">
                        Ask me anything about your workforce intelligence
                      </div>
                      <div className="space-y-2">
                        {suggestedPrompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs"
                            onClick={() => setInputMessage(prompt)}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "ai" && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="w-full max-w-full overflow-y-auto space-y-4">
                            {renderMessageContent(message)}
                          </div>

                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        {message.type === "user" && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-gray-600">Analyzing workforce data...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about workforce intelligence..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  // Full Page Version (Embedded in Page Layout)
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Workforce Intelligence Chat</h2>
            <p className="text-sm text-slate-600">Ask questions about your team and get AI-powered insights</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat} className="border-slate-200">
          Clear Chat
        </Button>
      </div>

      {/* Scrollable Chat Messages */}
      <ScrollArea className="flex-1 p-6" style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-medium mb-2">AI Workforce Assistant Ready</h3>
                    <p className="text-sm">Ask me anything about your workforce intelligence, employee performance, or optimization opportunities.</p>
                  </div>
                )}

                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "ai" && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-4 rounded-lg ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        {renderMessageContent(message)}
                        <div className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-slate-500"}`}>
                          {message.timestamp.toLocaleString()}
                        </div>
                      </div>
                      {message.type === "user" && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-gray-600">Analyzing workforce data...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-slate-200 bg-white">
        <div className="flex gap-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about workforce intelligence, employee performance, or optimization opportunities..."
            className="flex-1 border-slate-200"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;