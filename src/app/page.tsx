"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { QuestSelector } from "@/components/features";
import { LoadingQuest } from "@/components/ui";
import { Location } from "@/types/location";

interface QuestOptions {
  timeframe: string;
  difficulty: string;
  transportation: string;
  theme: string;
  location?: Location;
}

export default function Home() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questUrl, setQuestUrl] = useState<string | null>(null);

  const handleGenerateQuest = async (options: QuestOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Enhancing quest with Gemini AI:", options);
      
      const response = await fetch('/api/enhance-quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questInput: options }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Quest enhanced, storing URL:", result.redirectUrl);
        setQuestUrl(result.redirectUrl);
        setIsGenerating(false);
        // Don't redirect immediately - let QuestSelector handle the safety disclaimer
      } else {
        setError(result.error || 'Failed to generate quest');
        setIsGenerating(false);
      }
    } catch (err) {
      console.error("Quest enhancement error:", err);
      setError('Network error occurred while generating quest');
      setIsGenerating(false);
    }
  };

  const handleNavigateToQuest = () => {
    if (questUrl) {
      router.push(questUrl);
    }
  };

  // Show loading screen while generating
  if (isGenerating) {
    return <LoadingQuest error={error} />;
  }

  return (
    <QuestSelector 
      onGenerateQuest={handleGenerateQuest}
      onNavigateToQuest={handleNavigateToQuest}
      isGenerating={isGenerating}
      questReady={!!questUrl}
    />
  );
}