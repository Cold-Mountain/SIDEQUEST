"use client";

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout';

interface LoadingQuestProps {
  error?: string | null;
}

export function LoadingQuest({ error }: LoadingQuestProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  
  const loadingMessages = [
    "Finding your perfect adventure",
    "Scanning local attractions", 
    "Checking weather conditions",
    "Calculating travel times",
    "Personalizing your experience",
    "Almost ready"
  ];

  useEffect(() => {
    if (error) return;
    
    // Message cycling
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, [error, loadingMessages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating bubbles - deterministic positioning */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float-bubble"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 7) % 80}%`,
              width: `${25 + (i % 4) * 10}px`,
              height: `${25 + (i % 4) * 10}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 3)}s`
            }}
          />
        ))}
        
        {/* Pulsing rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-white/20 rounded-full animate-ping-slow" />
          <div className="absolute inset-4 border border-white/15 rounded-full animate-ping-slow" style={{animationDelay: '1s'}} />
          <div className="absolute inset-8 border border-white/10 rounded-full animate-ping-slow" style={{animationDelay: '2s'}} />
        </div>
      </div>
      
      <Container size="sm" className="relative z-10">
        <div className="text-center space-y-8">
          {error ? (
            <div className="space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="text-6xl animate-bounce">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-800">
                Quest Generation Failed
              </h1>
              <p className="text-lg text-gray-600">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main logo/icon area */}
              <div className="relative">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                  {/* Facebook-style loading icon */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] animate-spin-slow" />
                    <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                      <div className="text-3xl animate-pulse">🗺️</div>
                    </div>
                  </div>
                  
                  {/* Facebook-style company branding */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                      SIDEQUEST
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">
                      Adventure Discovery Platform
                    </p>
                  </div>
                  
                  {/* Loading message */}
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-gray-700">
                      {loadingMessages[currentMessage]}{dots}
                    </p>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Facebook-style loading cards preview */}
              <div className="space-y-4 opacity-60">
                <div className="text-sm text-white/80 font-medium">Preview of your quest:</div>
                
                {/* Skeleton cards */}
                {[...Array(2)].map((_, i) => (
                  <div 
                    key={i}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded-md w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded-md w-1/2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Loading dots */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-white/60 animate-pulse-wave"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>

      <style jsx>{`
        @keyframes float-bubble {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.9;
          }
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-wave {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-float-bubble {
          animation: float-bubble 4s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-wave {
          animation: pulse-wave 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}