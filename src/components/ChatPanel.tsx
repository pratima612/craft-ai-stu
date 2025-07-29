import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Upload, Bot, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string, image?: File) => void;
  isLoading?: boolean;
}

export const ChatPanel = ({ messages, onSendMessage, isLoading }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    
    onSendMessage(input, selectedImage || undefined);
    setInput("");
    setSelectedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-1">AI Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Describe the component you want to create
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <Card className="p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    👋 Welcome! I'm here to help you generate React components. 
                    Try asking me to create:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• "Create a modern button component"</li>
                    <li>• "Build a user profile card"</li>
                    <li>• "Make a responsive navigation bar"</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'ai' 
                  ? 'bg-primary/20' 
                  : 'bg-secondary/20'
              }`}>
                {message.type === 'ai' ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {message.type === 'ai' ? 'AI Assistant' : 'You'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.image && (
                  <img 
                    src={URL.createObjectURL(new Blob())} 
                    alt="Uploaded" 
                    className="max-w-full h-32 object-cover rounded-lg mb-2" 
                  />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        {selectedImage && (
          <div className="mb-3 p-2 bg-muted rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Image selected
              </Badge>
              <span className="text-xs text-muted-foreground truncate">
                {selectedImage.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your component..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSend} 
            disabled={isLoading || (!input.trim() && !selectedImage)}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};