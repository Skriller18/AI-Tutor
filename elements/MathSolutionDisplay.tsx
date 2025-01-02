import React, { useEffect } from 'react';
import Script from 'next/script';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface MathSolutionDisplayProps {
  solution: string;
}

export const MathSolutionDisplay: React.FC<MathSolutionDisplayProps> = ({ solution }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.();
    }
  }, [solution]);

  const splitIntoSteps = (text: string) => {
    return text.split(/(?=\*\*(?:Step \d+:|Problem Statement:|Final Answer:))/).filter(Boolean);
  };

  const processMathContent = (text: string) => {
    let processedText = text
      .replace(/\*\*/g, '')
      .replace(/\\begin\{align\*\}/g, '\\[\\begin{aligned}')
      .replace(/\\end\{align\*\}/g, '\\end{aligned}\\]')
      .replace(/\\\((.*?)\\\)/g, '\\($1\\)')
      .replace(/\\\[(.*?)\\\]/g, '\\[$1\\]')
      .replace(/\\sin/g, '\\sin')
      .replace(/\\cos/g, '\\cos')
      .replace(/\\tan/g, '\\tan')
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '\\frac{$1}{$2}')
      .replace(/_(\w)/g, '_{$1}')
      .replace(/\^(\w)/g, '^{$1}')
      .replace(/\\approx/g, '\\approx')
      .replace(/\\times/g, '\\times')
      .replace(/(\d+\.)\s/g, '<br>$1 ')
      .replace(/\n/g, '<br>');

    return processedText;
  };

  const getSectionType = (text: string) => {
    if (text.startsWith('**Problem Statement:'))
      return 'problem';
    if (text.startsWith('**Final Answer:'))
      return 'answer';
    if (text.startsWith('**Step'))
      return 'step';
    return 'text';
  };

  const sections = splitIntoSteps(solution);

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js"
        strategy="lazyOnload"
      />
      
      <Card className="bg-gray-900 p-6 max-w-4xl mx-auto text-gray-100 overflow-y-auto max-h-[calc(100vh-200px)]">
        {sections.map((section, index) => {
          const sectionType = getSectionType(section);
          
          if (sectionType === 'problem') {
            return (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Problem Statement</h2>
                <div 
                  className="text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: processMathContent(section.replace('**Problem Statement:**', ''))
                  }}
                />
              </div>
            );
          }
          
          if (sectionType === 'answer') {
            return (
              <div key={index} className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Final Answer</h3>
                <div 
                  className="text-xl text-center text-white"
                  dangerouslySetInnerHTML={{ 
                    __html: processMathContent(section.replace('**Final Answer:**', ''))
                  }}
                />
              </div>
            );
          }
          
          if (sectionType === 'step') {
            const [title, ...content] = section.split('\n');
            return (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-green-400">
                    {title.replace(/\*\*/g, '')}
                  </h3>
                </div>
                <div 
                  className="ml-8 text-gray-300 space-y-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: processMathContent(content.join('\n'))
                  }}
                />
              </div>
            );
          }
          
          return (
            <div 
              key={index}
              className="mb-4 text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: processMathContent(section)
              }}
            />
          );
        })}
      </Card>
    </>
  );
};