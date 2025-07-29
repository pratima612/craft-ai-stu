import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, User, LogOut, Settings, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
  onSettings?: () => void;
}

export const Header = ({ user, onLogout, onSettings }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg animate-pulse-glow">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Crafti AI Studio
              </h1>
              <p className="text-xs text-muted-foreground">Component Generator</p>
            </div>
          </div>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost">Login</Button>
              <Button variant="default">Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};