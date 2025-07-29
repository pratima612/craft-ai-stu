import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { ComponentPreview } from "@/components/ComponentPreview";
import { SessionManager } from "@/components/SessionManager";
import { PropertyEditor } from "@/components/PropertyEditor";
import { toast } from "@/hooks/use-toast";

// Mock data - replace with real API calls
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: string;
}

interface Session {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  messageCount: number;
  hasComponent: boolean;
}

interface ComponentData {
  jsx: string;
  css: string;
  preview: string;
}

const Index = () => {
  // State management
  const [user] = useState({ name: "Demo User", email: "demo@example.com" });
  const [currentView, setCurrentView] = useState<'sessions' | 'chat'>('sessions');
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      name: 'Modern Button Component',
      description: 'A sleek, customizable button with hover effects and multiple variants',
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 8,
      hasComponent: true
    },
    {
      id: '2', 
      name: 'User Profile Card',
      description: 'Clean profile card with avatar, name, and social links',
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 12,
      hasComponent: true
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [componentData, setComponentData] = useState<ComponentData>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>();
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);

  // Demo component data
  const demoComponent: ComponentData = {
    jsx: `import React from 'react';
import './button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const ModernButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick 
}) => {
  return (
    <button 
      className={\`modern-button \${variant} \${size}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
    css: `.modern-button {
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modern-button.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.modern-button.secondary {
  background: #f3f4f6;
  color: #374151;
}

.modern-button.outline {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}

.modern-button.small {
  padding: 8px 16px;
  font-size: 14px;
}

.modern-button.medium {
  padding: 12px 24px;
  font-size: 16px;
}

.modern-button.large {
  padding: 16px 32px;
  font-size: 18px;
}

.modern-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}`,
    preview: `<div style="padding: 40px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); min-height: 200px; display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center;">
      <button style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; border-radius: 8px; padding: 12px 24px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">Primary Button</button>
      <button style="background: #f3f4f6; color: #374151; border: none; border-radius: 8px; padding: 12px 24px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">Secondary Button</button>
      <button style="background: transparent; border: 2px solid #3b82f6; color: #3b82f6; border-radius: 8px; padding: 12px 24px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">Outline Button</button>
    </div>`
  };

  // Handlers
  const handleSendMessage = async (message: string, image?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      image: image ? URL.createObjectURL(image) : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I've created a modern button component based on your request! The component includes multiple variants (primary, secondary, outline) and different sizes. You can see the live preview on the right, and the code is available in the JSX/TSX and CSS tabs.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setComponentData(demoComponent);
      setIsLoading(false);
      
      toast({
        title: "Component Generated!",
        description: "Your button component is ready for preview and export.",
      });
    }, 2000);
  };

  const handleCreateSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      name: `New Session ${sessions.length + 1}`,
      description: 'Start building your component...',
      lastModified: new Date(),
      messageCount: 0,
      hasComponent: false
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setCurrentView('chat');
    setMessages([]);
    setComponentData(undefined);
    
    toast({
      title: "New Session Created",
      description: "Ready to start building your component!",
    });
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setCurrentView('chat');
    
    // Load demo data for existing sessions
    if (sessionId === '1') {
      setMessages([
        {
          id: '1',
          type: 'user',
          content: 'Create a modern button component with multiple variants',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'ai', 
          content: "I've created a modern button component with primary, secondary, and outline variants!",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
        }
      ]);
      setComponentData(demoComponent);
    } else {
      setMessages([]);
      setComponentData(undefined);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(undefined);
      setCurrentView('sessions');
    }
  };

  const handleDuplicateSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const newSession: Session = {
        ...session,
        id: Date.now().toString(),
        name: `${session.name} (Copy)`,
        lastModified: new Date()
      };
      setSessions(prev => [newSession, ...prev]);
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    // In real implementation, this would update the component code
    console.log('Property changed:', property, value);
    toast({
      title: "Property Updated",
      description: `${property} changed to ${value}`,
    });
  };

  if (currentView === 'sessions') {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={user} 
          onLogout={() => toast({ title: "Logged out" })}
          onSettings={() => toast({ title: "Settings opened" })}
        />
        <div className="flex h-[calc(100vh-4rem)]">
          <SessionManager
            sessions={sessions}
            currentSessionId={currentSessionId}
            onCreateSession={handleCreateSession}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onDuplicateSession={handleDuplicateSession}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center animate-float">
                <div className="text-4xl">🚀</div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                  Welcome to Crafti AI Studio
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  Your AI-powered component generator. Select a session to continue or create a new one to get started!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogout={() => setCurrentView('sessions')}
        onSettings={() => toast({ title: "Settings opened" })}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
        <ComponentPreview
          componentData={componentData}
          isLoading={isLoading}
          onRefresh={() => toast({ title: "Refreshed" })}
        />
        <PropertyEditor
          selectedElement={selectedElement}
          onPropertyChange={handlePropertyChange}
          onClose={() => setShowPropertyEditor(false)}
          isVisible={showPropertyEditor}
        />
      </div>
    </div>
  );
};

export default Index;
