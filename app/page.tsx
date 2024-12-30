'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { apiClient } from 'services/endpoint';
import { Button } from '@/components/ui/button';
import { FaEraser, FaPencilAlt, FaRedo } from 'react-icons/fa';

const CanvasDraw = dynamic(() => import('react-canvas-draw'), { ssr: false });

const CanvasDrawWithRef = React.forwardRef((props: any, ref: React.Ref<any>) => (
  <CanvasDraw {...props} ref={ref} />
));

const questions = [
  "The number of solutions of the equation 4 sin2x – 4cos3x + 9 – 4 cosx = 0; x  [ –2, 2] is",
  "Consider a triangle ABC where A(1,3,2), B(–2,8,0) andC(3,6,7). If the angle bisector of angle BAC meets the line BC at D, then the length of the projection of the vector AD on the vector AC is"
];

const DrawBoard = () => {
  const canvasRef = useRef<any>(null);
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const [brushRadius, setBrushRadius] = useState(2);
  const [activeTool, setActiveTool] = useState("pencil");

  useEffect(() => {
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }, []);

  const handleSolve = async () => {
    const solution = await apiClient.solve(question);
    setSolution(solution);
  };

  const handleHint = async () => {
    console.log("Hint button clicked");
    if (canvasRef.current) {
      const drawingData = canvasRef.current.getDataURL('image/png');
      const blob = await fetch(drawingData).then(r => r.blob());
      console.log("Sending hint request with question:", question);
      const response = await apiClient.getHint(question, blob);
      setSolution(response);
    }
  };

  const handleCorrect = async () => {
    console.log("Correct button clicked");
    if (canvasRef.current) {
      const drawingData = canvasRef.current.getDataURL('image/png');
      console.log("Drawing data URL:", drawingData);
      if (drawingData) {
        const blob = await fetch(drawingData).then(r => r.blob());
        console.log("Sending correct request with question:", question);
        const response = await apiClient.checkSolution(question, blob);
        setSolution(response);
      } else {
        console.error("No drawing data available.");
      }
    } else {
      console.error("Canvas reference is not set.");
    }
  };

  const handleErase = () => {
    setBrushColor("#2D2D2D");
    setBrushRadius(30);
    setActiveTool("eraser");
  };

  const handlePencil = () => {
    setBrushColor("#FFFFFF");
    setBrushRadius(2);
    setActiveTool("pencil");
  };

  const handleReload = () => {
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    setSolution("");
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1E1E1E] text-gray-200">
      <div className="bg-black p-6 text-left text-lg font-semibold w-full">Elemento</div>
      <div className="flex flex-1">
      <div className="w-[500px] border-r border-gray-700 p-6 flex flex-col">
        <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{question}</h2>
          <button 
          onClick={handleReload} 
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
          >
          <FaRedo className="text-white" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-800"
          onClick={handleSolve}
          >
          Solve
          </Button>
          <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-800"
          onClick={handleHint}
          >
          Hint
          </Button>
          <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent border-gray-700 hover:bg-gray-800"
          onClick={handleCorrect}
          >
          Correct
          </Button>
        </div>
        </div>
        
        {solution && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="whitespace-pre-wrap text-sm">{solution}</p>
        </div>
        )}
      </div>

      <div className="flex-1 p-6 relative">
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
        <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={handleErase} 
          className={`p-2 rounded-full ${activeTool === 'eraser' ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <FaEraser className="text-white" />
        </button>
        <button 
          onClick={handlePencil} 
          className={`p-2 rounded-full ${activeTool === 'pencil' ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <FaPencilAlt className="text-white" />
        </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DrawBoard;