"use client";

import * as React from "react";
import { Button, Select } from "@/components/ui";
import { Container } from "@/components/layout";
import { LocationInput } from "./LocationInput";
import type { Location } from "@/types/location";

interface QuestOptions {
  timeframe: string;
  difficulty: string;
  transportation: string;
  theme: string;
  location?: Location;
}

interface QuestSelectorProps {
  onGenerateQuest: (options: QuestOptions) => void;
  isGenerating?: boolean;
}

const timeframeOptions = [
  { value: "quick", label: "Quick Adventure (< 1 hour)" },
  { value: "afternoon", label: "Afternoon Quest (few hours)" },
  { value: "day", label: "Day Journey (full day)" },
  { value: "epic", label: "Epic Saga (multi-day)" }
];

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "extreme", label: "Extreme" }
];

const transportationOptions = [
  { value: "has_car", label: "Has Car" },
  { value: "no_car", label: "No Car" }
];

const themeOptions = [
  { 
    value: "journey", 
    label: "Journey", 
    description: "Travel-based adventures to explore new places and experiences" 
  },
  { 
    value: "life_changing", 
    label: "Life-Changing", 
    description: "Transformative experiences that push personal boundaries" 
  },
  { 
    value: "playbook", 
    label: "The Playbook", 
    description: "Strategic adventures for when you want to make your move" 
  },
  { 
    value: "virtuous", 
    label: "Virtuous Mode", 
    description: "Character-building activities focused on personal growth" 
  }
];

export function QuestSelector({ onGenerateQuest, isGenerating = false }: QuestSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [questStarted, setQuestStarted] = React.useState(false);
  const [options, setOptions] = React.useState<QuestOptions>({
    timeframe: "",
    difficulty: "",
    transportation: "",
    theme: "",
    location: undefined
  });

  const handleOptionChange = (key: keyof QuestOptions, value: string | Location) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (location: Location | null) => {
    setOptions(prev => ({ ...prev, location: location || undefined }));
  };

  const handleGenerateQuest = async () => {
    if (isComplete) {
      setQuestStarted(true);
      setIsOpen(false);
      await onGenerateQuest(options);
    }
  };

  const isComplete = options.timeframe && options.difficulty && options.transportation && options.theme && options.location;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dynamic-background relative">
      <div className="floating-elements"></div>
      <Container size="sm">
        <div className="text-center space-y-8">
          <div className="space-y-8">
            <h1 className="text-display text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)]" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>
              Find Your <span className="text-[var(--color-secondary)]">Quest</span>
            </h1>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => isComplete && !questStarted && !isGenerating ? handleGenerateQuest() : undefined}
                disabled={!isComplete || questStarted || isGenerating}
                className={`${isComplete && !questStarted && !isGenerating ? 'mystical-quest-ready' : 'secondary-glow'} transition-all duration-500`}
                style={{ 
                  background: questStarted || isGenerating ? '#666' : '#4C1D95',
                  color: 'white',
                  fontWeight: '700',
                  padding: '16px 32px'
                }}
              >
                {isGenerating ? 'Generating Quest...' : questStarted ? 'Quest Generated!' : 'Generate Quest'}
              </Button>
              
              {!questStarted && !isGenerating && (
                <Button 
                  variant="outline"
                  size="default"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-12 h-12 p-0 rounded-full"
                  style={{ 
                    background: 'white',
                    color: '#4C1D95',
                    borderColor: '#4C1D95',
                    fontWeight: '700'
                  }}
                >
                  ▼
                </Button>
              )}
            </div>

            {isOpen && !questStarted && !isGenerating && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 space-y-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Timeframe
                    </label>
                    <Select
                      variant="mystical"
                      value={options.timeframe}
                      onChange={(e) => handleOptionChange("timeframe", e.target.value)}
                    >
                      <option value="">Select timeframe...</option>
                      {timeframeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Difficulty
                    </label>
                    <Select
                      variant="mystical"
                      value={options.difficulty}
                      onChange={(e) => handleOptionChange("difficulty", e.target.value)}
                    >
                      <option value="">Select difficulty...</option>
                      {difficultyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Transportation
                    </label>
                    <Select
                      variant="mystical"
                      value={options.transportation}
                      onChange={(e) => handleOptionChange("transportation", e.target.value)}
                    >
                      <option value="">Select transportation...</option>
                      {transportationOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Theme
                    </label>
                    <div className="relative">
                      <Select
                        variant="mystical"
                        value={options.theme}
                        onChange={(e) => handleOptionChange("theme", e.target.value)}
                      >
                        <option value="">Select theme...</option>
                        {themeOptions.map(option => (
                          <option key={option.value} value={option.value} title={option.description}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    
                    {/* Theme descriptions on hover */}
                    <div className="mt-2 space-y-1">
                      {themeOptions.map(option => (
                        <div
                          key={option.value}
                          className={`text-xs text-[var(--color-text-muted)] transition-opacity duration-200 ${
                            options.theme === option.value ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                          }`}
                        >
                          {option.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Location
                  </label>
                  <LocationInput onLocationChange={handleLocationChange} />
                </div>

              </div>
            )}

          </div>

        </div>
      </Container>
    </div>
  );
}