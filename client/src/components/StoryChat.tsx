import { FC, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { incrementMessageCount } from '@/lib/storage';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface StoryChatProps {
  topicId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

export const StoryChat: FC<StoryChatProps> = ({ topicId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicId, message }),
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
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      console.error('Chat error:', error);
    },
  });

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    incrementMessageCount(topicId);

    try {
      const response = await chatMutation.mutateAsync(input);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      incrementMessageCount(topicId);
    } catch (error) {
      // Error is handled by mutation error callback
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] p-0 bg-background border-t"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="h-12 flex-shrink-0 border-b p-4">
            <SheetTitle className="text-lg">Chat</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2 bg-muted animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex gap-2 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-transparent"
              disabled={chatMutation.isPending}
            />
            <Button onClick={handleSend} disabled={chatMutation.isPending}>
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};