import { FC, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockAIResponses } from '@/data/topics';
import { incrementMessageCount } from '@/lib/storage';

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

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { text: input, isUser: true }
    ];

    // Simulate AI response
    const responses = mockAIResponses[topicId];
    if (responses && responses.length > 0) {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      newMessages.push({ text: randomResponse, isUser: false });
      // Increment twice for user message + AI response
      incrementMessageCount(topicId);
      incrementMessageCount(topicId);
    }

    setMessages(newMessages);
    setInput('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] p-0 bg-background/95 backdrop-blur-sm border-t border-white/20"
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
          </div>

          <div className="p-4 flex gap-2 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-transparent"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};