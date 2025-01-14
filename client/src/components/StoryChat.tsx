'use client';

import { FC, useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetPortal,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { incrementMessageCount } from '@/lib/storage';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Topic } from '@/data/topics';

interface StoryChatProps {
  topic: Topic;
  currentSlideContent?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'chat_history';

export const StoryChat: FC<StoryChatProps> = ({
  topic,
  currentSlideContent,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Include current slide content in the message if available
      const contextMessage = currentSlideContent
        ? `[Context: ${currentSlideContent}]\n\nUser: ${message}`
        : message;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.id, message: contextMessage }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      return data.response;
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.',
      });
      console.error('Chat error:', error);
    },
  });

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = { text: input, isUser: true, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    incrementMessageCount(topic.id);

    // Focus input after sending
    inputRef.current?.focus();

    try {
      const response = await chatMutation.mutateAsync(input);
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false, timestamp: Date.now() },
      ]);
      incrementMessageCount(topic.id);
    } catch (error) {
      // Error is handled by mutation error callback
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetPortal>
        <SheetContent
          side="bottom"
          className="h-[80vh] p-0 bg-background border-t">
          <div className="flex flex-col h-full">
            <SheetHeader className="h-12 flex-shrink-0 border-b p-4">
              <SheetTitle className="text-lg">Chat History</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, i) => (
                <div
                  key={message.timestamp}
                  className={`flex ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}>
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-2">
                    <div className="w-12 h-6 flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={chatMutation.isPending}
              />
              <Button onClick={handleSend} disabled={chatMutation.isPending}>
                Send
              </Button>
            </div>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
};
