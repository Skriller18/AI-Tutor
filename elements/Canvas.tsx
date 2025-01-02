'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Camera, Eraser, Pen, PenTool } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const CanvasDraw = dynamic(() => import('react-canvas-draw'), { ssr: false });

const CanvasDrawWithRef = React.forwardRef((props: any, ref: React.Ref<any>) => (
  <CanvasDraw {...props} ref={ref} />
));

interface CanvasProps {
  onDrawingChange?: (drawingData: string) => void;
}

const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  const canvasRef = useRef<any>(null);
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const [brushRadius, setBrushRadius] = useState(2);
  const [activeTool, setActiveTool] = useState("pen");
  const [screenshots, setScreenshots] = useState<{url: string, timestamp: string}[]>([]);

  const tools = [
    { id: 'pen', icon: Pen, radius: 2, label: 'Pen' },
    { id: 'marker', icon: PenTool, radius: 6, label: 'Marker' },
    { id: 'eraser', icon: Eraser, radius: 20, label: 'Eraser' }
  ];

  const colors = [
    { id: 'white', value: '#FFFFFF', label: 'White' },
    { id: 'blue', value: '#3B82F6', label: 'Blue' },
    { id: 'green', value: '#22C55E', label: 'Green' },
    { id: 'yellow', value: '#EAB308', label: 'Yellow' },
    { id: 'red', value: '#EF4444', label: 'Red' }
  ];

  useEffect(() => {
    if (activeTool === 'eraser') {
      setBrushColor('#2D2D2D');
    } else {
      setBrushColor("#FFFFFF");
    }
  }, [activeTool]);

  const handleToolChange = (toolId: string, radius: number) => {
    setActiveTool(toolId);
    setBrushRadius(radius);
  };

  const handleColorChange = (color: string) => {
    if (activeTool !== 'eraser') {
      setBrushColor(color);
    }
  };
   
  const takeScreenshot = async () => {
    const element = document.querySelector('#canvas-element'); 
    if (element) {
      const canvas = await html2canvas(element as HTMLElement);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'screenshot.png');
        }
      });
    } else {
      console.error("Canvas element not found.");
    }
  };

  React.useImperativeHandle(ref, () => canvasRef.current);

  return (
    <div className="relative">
      <CanvasDrawWithRef
        ref={canvasRef}
        brushColor={brushColor}
        brushRadius={brushRadius}
        lazyRadius={0}
        canvasWidth={typeof window !== 'undefined' ? window.innerWidth - 450 : 0}
        canvasHeight={typeof window !== 'undefined' ? window.innerHeight - 100 : 0}
        hideGrid={true}
        backgroundColor="#2D2D2D"
        className="rounded-lg border border-gray-700"
      />
      
      <div className="absolute top-4 left-4 flex flex-col gap-4 bg-gray-800/90 p-4 rounded-2xl backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            {tools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleToolChange(tool.id, tool.radius)}
                    className={`p-3 rounded-full transition-all ${
                      activeTool === tool.id
                        ? 'bg-gray-600 shadow-lg scale-110'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <tool.icon className="w-5 h-5 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        <div className="w-px h-px bg-gray-600 my-2" />
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            {colors.map((color) => (
              <Tooltip key={color.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleColorChange(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      brushColor === color.value && activeTool !== 'eraser'
                        ? 'scale-110 shadow-lg border-white'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{color.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        <div className="w-px h-px bg-gray-600 my-2" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={takeScreenshot}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Take Screenshot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});

export default Canvas;