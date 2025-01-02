import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { MathSolutionDisplay } from './MathSolutionDisplay';

interface Message {
  text: string;
  isUser: boolean;
  type: 'text' | 'solution';
  solution?: string;
}

interface ChatWindowProps {
  chatWindowRef: React.RefObject<ChatWindowRef>;
  className?: string;
}

export interface ChatWindowRef {
  addSolutionMessage: (solution: string) => void;
}

const ChatWindow = forwardRef<ChatWindowRef, ChatWindowProps>(({ className }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useImperativeHandle(ref, () => ({
    addSolutionMessage: (solution: string) => {
      setMessages(prev => [...prev, {
        text: "Here's the solution:",
        isUser: false,
        type: 'solution',
        solution: solution
      }]);
    }
  }));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { 
      text: inputText, 
      isUser: true, 
      type: 'text' 
    }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I'll help you solve this problem. What specific part are you stuck on?", 
        isUser: false,
        type: 'text'
      }]);
    }, 500);

    setInputText('');
  };

  return (
    <Card className={`flex flex-col h-full border-gray-700 bg-gray-800 ${className}`}>      
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">Chat Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} w-full`}
          >
            <div
              className={`${
                message.type === 'solution' 
                  ? 'bg-gray-800 rounded-lg p-4 max-w-[90%] w-full'
                  : `max-w-[70%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`
              }`}
            >
              <p className="text-gray-200">{message.text}</p>
              {message.type === 'solution' && message.solution && (
                <div className="mt-2 border-t border-gray-700 pt-2">
                  <MathSolutionDisplay solution={message.solution} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 p-4 mt-auto">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-200"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <Button type="submit" variant="default">
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;