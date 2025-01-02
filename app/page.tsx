'use client';

import React, { useRef, useState, useEffect } from 'react';
import { apiClient } from 'services/endpoint';
import { Button } from '@/components/ui/button';
import { FaRedo } from 'react-icons/fa';
import Canvas from 'elements/Canvas';
import ChatWindow from 'elements/ChatWindow';
import{ ChatWindowRef } from 'elements/ChatWindow';

const questions = [
  "The number of solutions of the equation 4 sin2x – 4cos3x + 9 – 4 cosx = 0; x  [ –2, 2] is",
  "Consider a triangle ABC where A(1,3,2), B(–2,8,0) andC(3,6,7). If the angle bisector of angle BAC meets the line BC at D, then the length of the projection of the vector AD on the vector AC is"
];

const DrawBoard = () => {
  const canvasRef = useRef<any>(null);
  const chatWindowRef = useRef<ChatWindowRef>(null);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }, []);

  const handleSolve = async () => {
    try {
      const solution = await apiClient.solve(question);
      chatWindowRef.current?.addSolutionMessage(solution);
    } catch (error) {
      console.error("Error solving problem:", error);
    }
  };

  const handleHint = async () => {
    try {
      if (!canvasRef.current) return;
      
      const drawingData = canvasRef.current.getDataURL('image/png');
      if (!drawingData) return;
  
      const blob = await fetch(drawingData).then(r => r.blob());
      const response = await apiClient.getHint(question, blob);
      chatWindowRef.current?.addSolutionMessage(response);
    } catch (error) {
      console.error("Error getting hint:", error);
    }
  };
  
  const handleCorrect = async () => {
    try {
      if (!canvasRef.current) return;
      
      const drawingData = canvasRef.current.getDataURL('image/png');
      if (!drawingData) return;
  
      const blob = await fetch(drawingData).then(r => r.blob());
      const response = await apiClient.checkSolution(question, blob);
      chatWindowRef.current?.addSolutionMessage(response);
    } catch (error) {
      console.error("Error checking solution:", error);
    }
  };

  const handleReload = () => {
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1E1E1E] text-gray-200">
      <div className="bg-black p-6 text-left text-lg font-semibold w-full">Elemento</div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{question}</h2>
          <button 
            onClick={handleReload} 
            className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
          >
            <FaRedo className="text-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-[500px] border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
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
          
          <div className="flex-1">
            <ChatWindow 
              chatWindowRef={chatWindowRef}
              className="h-full rounded-none border-0" 
            />
          </div>
        </div>

        <div className="flex-1 p-6">
          <Canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default DrawBoard;