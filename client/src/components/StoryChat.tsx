'use client';

import { FC, useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { incrementMessageCount } from '@/lib/storage';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Topic } from '@/data/topics';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Focus input after sending with a slight delay
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      const response = await chatMutation.mutateAsync(input);
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false, timestamp: Date.now() },
      ]);
      incrementMessageCount(topic.id);
      // Ensure focus after response
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (error) {
      // Error is handled by mutation error callback
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[100dvh] md:h-[85vh] p-0 bg-background border-t flex flex-col">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Chat</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  'p-4 rounded-lg max-w-[85%]',
                  message.isUser
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                )}>
                <p className="text-sm">{message.text}</p>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="bg-muted p-4 rounded-lg max-w-[85%] animate-pulse">
                <p className="text-sm">Typing...</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={chatMutation.isPending || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
