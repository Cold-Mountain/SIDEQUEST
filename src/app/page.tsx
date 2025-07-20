"use client";

import { useState } from "react";
import { QuestSelector } from "@/components/features";
import { GeneratedQuest, QuestGenerationResponse } from "@/types/database";

interface QuestOptions {
  timeframe: string;
  difficulty: string;
  transportation: string;
  theme: string;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
}

export default function Home() {
  const [generatedQuests, setGeneratedQuests] = useState<GeneratedQuest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questSelectorKey, setQuestSelectorKey] = useState(0);

  const handleGenerateQuest = async (options: QuestOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating quest with options:", options);
      
      // UI values now match API format directly
      const apiOptions = options;
      
      console.log("Translated options for API:", apiOptions);
      
      const response = await fetch('/api/generate-quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiOptions),
      });

      const result: QuestGenerationResponse = await response.json();
      
      if (result.success) {
        setGeneratedQuests(result.quests);
        console.log("Generated quests:", result.quests);
      } else {
        setError(result.error || 'Failed to generate quests');
      }
    } catch (err) {
      console.error("Quest generation error:", err);
      setError('Network error occurred while generating quests');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <QuestSelector 
        key={questSelectorKey}
        onGenerateQuest={handleGenerateQuest}
        isGenerating={isGenerating}
      />
      
      {error && (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}
      
      {generatedQuests.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-primary)]">
            Your Quest Options
          </h2>
          
          <div className="space-y-4">
            {generatedQuests.map((quest, index) => (
              <div 
                key={quest.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Quest Option {index + 1}
                  </h3>
                  <div className="text-sm text-[var(--color-text-muted)] text-right">
                    <div>Time: {quest.totalTime} minutes</div>
                    <div>Difficulty: {quest.difficulty}</div>
                  </div>
                </div>
                
                <p className="text-[var(--color-text-primary)] text-lg leading-relaxed">
                  {quest.description}
                </p>
                
                {quest.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quest.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-[var(--color-secondary)] text-white text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setGeneratedQuests([]);
                setQuestSelectorKey(prev => prev + 1);
              }}
              className="px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-white font-medium rounded-lg transition-colors"
            >
              Generate New Quests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}