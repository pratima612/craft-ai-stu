import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Type, 
  Layout, 
  Zap,
  X,
  Settings2
} from "lucide-react";

interface PropertyEditorProps {
  selectedElement?: {
    id: string;
    type: string;
    properties: Record<string, any>;
  };
  onPropertyChange: (property: string, value: any) => void;
  onClose: () => void;
  isVisible: boolean;
}

export const PropertyEditor = ({ 
  selectedElement, 
  onPropertyChange, 
  onClose, 
  isVisible 
}: PropertyEditorProps) => {
  const [colorInputs, setColorInputs] = useState({
    background: selectedElement?.properties?.backgroundColor || "#ffffff",
    text: selectedElement?.properties?.color || "#000000",
  });

  if (!isVisible || !selectedElement) return null;

  const handleColorChange = (type: 'background' | 'text', color: string) => {
    setColorInputs(prev => ({ ...prev, [type]: color }));
    onPropertyChange(type === 'background' ? 'backgroundColor' : 'color', color);
  };

  const handleSliderChange = (property: string, value: number[]) => {
    onPropertyChange(property, value[0]);
  };

  return (
    <Card className="fixed right-4 top-20 w-80 bg-card/95 backdrop-blur-sm border shadow-lg z-50 animate-in slide-in-from-right">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Property Editor</h3>
              <p className="text-sm text-muted-foreground">
                {selectedElement.type}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Properties */}
      <div className="p-4">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="style" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="h-3 w-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-4 mt-4">
            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Colors</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Background</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                      style={{ backgroundColor: colorInputs.background }}
                      onClick={() => document.getElementById('bg-color')?.click()}
                    />
                    <Input
                      id="bg-color"
                      type="color"
                      value={colorInputs.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="sr-only"
                    />
                    <Input
                      value={colorInputs.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="text-xs"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Text</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                      style={{ backgroundColor: colorInputs.text }}
                      onClick={() => document.getElementById('text-color')?.click()}
                    />
                    <Input
                      id="text-color"
                      type="color"
                      value={colorInputs.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="sr-only"
                    />
                    <Input
                      value={colorInputs.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Border Radius</Label>
              <Slider
                value={[selectedElement.properties?.borderRadius || 0]}
                onValueChange={(value) => handleSliderChange('borderRadius', value)}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0px</span>
                <span>{selectedElement.properties?.borderRadius || 0}px</span>
                <span>50px</span>
              </div>
            </div>

            {/* Shadow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Shadow</Label>
                <Switch
                  checked={selectedElement.properties?.boxShadow !== 'none'}
                  onCheckedChange={(checked) => 
                    onPropertyChange('boxShadow', checked ? '0 4px 6px rgba(0,0,0,0.1)' : 'none')
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            {/* Padding */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Padding</Label>
              <Slider
                value={[selectedElement.properties?.padding || 16]}
                onValueChange={(value) => handleSliderChange('padding', value)}
                max={100}
                step={4}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0px</span>
                <span>{selectedElement.properties?.padding || 16}px</span>
                <span>100px</span>
              </div>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Width</Label>
              <Input
                value={selectedElement.properties?.width || 'auto'}
                onChange={(e) => onPropertyChange('width', e.target.value)}
                placeholder="auto, 100px, 50%, etc."
                className="text-sm"
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Height</Label>
              <Input
                value={selectedElement.properties?.height || 'auto'}
                onChange={(e) => onPropertyChange('height', e.target.value)}
                placeholder="auto, 100px, 50%, etc."
                className="text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-4">
            {/* Text Content */}
            {selectedElement.type === 'button' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Button Text</Label>
                <Input
                  value={selectedElement.properties?.text || ''}
                  onChange={(e) => onPropertyChange('text', e.target.value)}
                  placeholder="Button text"
                  className="text-sm"
                />
              </div>
            )}

            {/* Font Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Font Size</Label>
              <Slider
                value={[parseInt(selectedElement.properties?.fontSize) || 16]}
                onValueChange={(value) => handleSliderChange('fontSize', value)}
                min={8}
                max={72}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8px</span>
                <span>{parseInt(selectedElement.properties?.fontSize) || 16}px</span>
                <span>72px</span>
              </div>
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Font Weight</Label>
              <div className="grid grid-cols-3 gap-2">
                {['normal', 'bold', '600'].map((weight) => (
                  <Button
                    key={weight}
                    variant={selectedElement.properties?.fontWeight === weight ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPropertyChange('fontWeight', weight)}
                    className="text-xs"
                  >
                    {weight === 'normal' ? 'Normal' : weight === 'bold' ? 'Bold' : 'Semi'}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Apply Button */}
        <div className="mt-6 pt-4 border-t border-border">
          <Button onClick={onClose} className="w-full" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};