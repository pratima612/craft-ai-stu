import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Clock, 
  Trash2, 
  Copy,
  FileText,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface Session {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  messageCount: number;
  hasComponent: boolean;
}

interface SessionManagerProps {
  sessions: Session[];
  currentSessionId?: string;
  onCreateSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onDuplicateSession: (sessionId: string) => void;
}

export const SessionManager = ({ 
  sessions, 
  currentSessionId, 
  onCreateSession, 
  onSelectSession, 
  onDeleteSession,
  onDuplicateSession 
}: SessionManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (sessionId: string, sessionName: string) => {
    if (confirm(`Delete session "${sessionName}"? This action cannot be undone.`)) {
      onDeleteSession(sessionId);
      toast({
        title: "Session deleted",
        description: `"${sessionName}" has been removed.`,
      });
    }
  };

  const handleDuplicate = (sessionId: string, sessionName: string) => {
    onDuplicateSession(sessionId);
    toast({
      title: "Session duplicated",
      description: `Created a copy of "${sessionName}".`,
    });
  };

  const formatLastModified = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Sessions</h2>
          <Button onClick={onCreateSession} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                {searchQuery ? "No sessions found" : "No sessions yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Create your first session to get started"}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <Card
                key={session.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  currentSessionId === session.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{session.name}</h3>
                      {session.hasComponent && (
                        <Badge variant="secondary" className="text-xs">
                          Component
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {session.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastModified(session.lastModified)}
                      </div>
                      <span>{session.messageCount} messages</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(session.id, session.name);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(session.id, session.name);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{sessions.length} total sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{sessions.filter(s => s.hasComponent).length} with components</span>
          </div>
        </div>
      </div>
    </div>
  );
};