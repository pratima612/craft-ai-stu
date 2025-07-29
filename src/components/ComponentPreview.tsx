import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Download, 
  RefreshCw, 
  Maximize2, 
  Smartphone, 
  Tablet, 
  Monitor,
  Code2,
  Palette
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ComponentData {
  jsx: string;
  css: string;
  preview: string;
}

interface ComponentPreviewProps {
  componentData?: ComponentData;
  isLoading?: boolean;
  onRefresh?: () => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const ComponentPreview = ({ componentData, isLoading, onRefresh }: ComponentPreviewProps) => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const handleDownload = () => {
    if (!componentData) return;
    
    const zip = {
      'component.tsx': componentData.jsx,
      'component.css': componentData.css,
      'README.md': '# Generated Component\n\nCreated with Crafti AI Studio'
    };

    // In real implementation, use JSZip library
    const blob = new Blob([JSON.stringify(zip, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.zip';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Component files downloaded as ZIP",
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Component Preview</h2>
            {componentData && (
              <Badge variant="outline" className="text-xs">
                Ready
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewport('mobile')}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === 'tablet' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewport('tablet')}
                className="h-8 w-8 p-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewport('desktop')}
                className="h-8 w-8 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload} disabled={!componentData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {!componentData && !isLoading ? (
          <Card className="h-full flex items-center justify-center bg-gradient-subtle">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Code2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ready to Create</h3>
                <p className="text-muted-foreground max-w-md">
                  Start a conversation with the AI assistant to generate your first component. 
                  Describe what you want to build and watch the magic happen!
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="jsx" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                JSX/TSX
              </TabsTrigger>
              <TabsTrigger value="css" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                CSS
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4">
              <TabsContent value="preview" className="h-full m-0">
                <Card className="h-full p-6 bg-background">
                  <div className={`mx-auto transition-all duration-300 ${getViewportStyles()}`}>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center space-y-4">
                          <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                            <Code2 className="h-6 w-6 text-primary animate-spin" />
                          </div>
                          <p className="text-muted-foreground">Generating component...</p>
                        </div>
                      </div>
                    ) : componentData ? (
                      <div 
                        className="component-preview"
                        dangerouslySetInnerHTML={{ __html: componentData.preview }}
                      />
                    ) : null}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="jsx" className="h-full m-0">
                <Card className="h-full">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-medium">Component Code</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => componentData && handleCopy(componentData.jsx, 'JSX')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 overflow-auto h-full">
                    <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      <code>{componentData?.jsx || '// Component code will appear here...'}</code>
                    </pre>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="css" className="h-full m-0">
                <Card className="h-full">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-medium">Styles</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => componentData && handleCopy(componentData.css, 'CSS')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 overflow-auto h-full">
                    <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      <code>{componentData?.css || '/* CSS styles will appear here... */'}</code>
                    </pre>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
};