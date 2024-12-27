'use client';

import { TextProvider } from '../components/TextContext';
import TextToSpeech from '../components/TextToSpeech';
import Pills from '../components/Pills';
import { Button } from "@/components/ui/button";
import 'tailwindcss/tailwind.css';
import '@fontsource/roboto';
import '@fontsource/lato';

export default function Page() {
    const handleTextToTextClick = () => {
        console.log("Text-to-Text clicked");
    };

    const handleSpeechToSpeechClick = () => {
        alert("Coming Soon...");
    };

    return (
        <TextProvider>
            <div className="min-h-screen flex items-center justify-center relative">
                <div className="container mx-auto px-4 font-lato bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-8">
                    <header className="mb-8 text-left">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Indri</h1>
                        <h2 className="text-2xl text-black-600 mb-4"></h2>
                        <div className="flex space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTextToTextClick}
                                className="flex items-center space-x-2 bg-black/80"
                            >
                                Text-to-Text
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSpeechToSpeechClick}
                                className="flex items-center space-x-2 bg-black/80"
                            >
                                Speech-to-Speech
                            </Button>
                        </div>
                    </header>
                    <main className="space-y-8">
                        <TextToSpeech />
                        <Pills />
                    </main>
                </div>
            </div>
        </TextProvider>
    );
}