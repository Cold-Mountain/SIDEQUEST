"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Button, Select, SafetyDisclaimerModal, QuestConfirmationModal } from "@/components/ui";
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
  onNavigateToQuest: () => void;
  isGenerating?: boolean;
  questReady?: boolean;
}


const themeOptions = [
  { 
    value: "adventure", 
    label: "Adventure Mode", 
    description: "Location-based quests featuring unique places and hidden gems" 
  },
  { 
    value: "wildcard", 
    label: "Wild Card Mode", 
    description: "Diverse activities and experiences for any setting" 
  }
];

export function QuestSelector({ onGenerateQuest, onNavigateToQuest, isGenerating = false, questReady = false }: QuestSelectorProps) {
  const router = useRouter();
  const [questStarted, setQuestStarted] = React.useState(false);
  const [showSafetyDisclaimer, setShowSafetyDisclaimer] = React.useState(false);
  const [showQuestConfirmation, setShowQuestConfirmation] = React.useState(false);
  const [options, setOptions] = React.useState<QuestOptions>({
    timeframe: "afternoon",
    difficulty: "medium",
    transportation: "has_car",
    theme: "",
    location: undefined
  });

  // Show safety disclaimer when quest is ready
  React.useEffect(() => {
    if (questReady && !showSafetyDisclaimer) {
      setShowSafetyDisclaimer(true);
    }
  }, [questReady, showSafetyDisclaimer]);

  const handleOptionChange = (key: keyof QuestOptions, value: string | Location) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (location: Location | null) => {
    setOptions(prev => ({ ...prev, location: location || undefined }));
  };

  const handleInitiateQuest = () => {
    if (isComplete) {
      setShowQuestConfirmation(true);
    }
  };

  const handleSafetyAccepted = () => {
    setShowSafetyDisclaimer(false);
    // Quest generation already completed, navigate to quest
    onNavigateToQuest();
  };

  const handleSafetyDeclined = () => {
    setShowSafetyDisclaimer(false);
    // Reset quest generation state
    setQuestStarted(false);
  };

  const handleQuestConfirmed = async () => {
    setShowQuestConfirmation(false);
    setQuestStarted(true);
    setIsOpen(false);
    
    // Generate quest - safety disclaimer will show automatically when ready
    await onGenerateQuest(options);
  };

  const handleQuestCancelled = () => {
    setShowQuestConfirmation(false);
  };

  const handleMakeYourOwn = () => {
    if (options.location) {
      // Create a location name from available data
      const locationName = options.location.city || 
                          `${options.location.latitude.toFixed(2)}, ${options.location.longitude.toFixed(2)}`;
      // Navigate to make-your-own page with location data
      router.push(`/make-your-own?lat=${options.location.latitude}&lng=${options.location.longitude}&location=${encodeURIComponent(locationName)}`);
    }
  };

  const isComplete = options.theme && options.location;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] relative">
      {/* Floating elements for teal background - deterministic positioning */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 17) % 70}%`,
              width: `${40 + (i % 3) * 15}px`,
              height: `${40 + (i % 3) * 15}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + (i % 3)}s`
            }}
          />
        ))}
      </div>
      <Container size="sm">
        <div className="text-center space-y-8">
          <div className="space-y-8">
            <h1 className="text-display text-5xl lg:text-6xl font-bold text-white" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>
              Find Your <span className="text-cyan-400 font-bold">Quest</span>
            </h1>
          </div>

          <div className="space-y-6">
            {/* Quest Options - Always Visible */}
            <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 space-y-6 max-w-md mx-auto shadow-2xl mb-6" style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(0,0,0,0.5)' }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 drop-shadow-md">
                    Quest Mode
                  </label>
                  <div className="relative">
                    <Select
                      variant="mystical"
                      value={options.theme}
                      onChange={(e) => handleOptionChange("theme", e.target.value)}
                    >
                      <option value="">Select quest mode...</option>
                      {themeOptions.map(option => (
                        <option key={option.value} value={option.value} title={option.description}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  {/* Theme descriptions */}
                  <div className="mt-2 space-y-1">
                    {themeOptions.map(option => (
                      <div
                        key={option.value}
                        className={`text-xs text-cyan-200 drop-shadow-sm transition-opacity duration-200 ${
                          options.theme === option.value ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                        }`}
                      >
                        {option.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2 drop-shadow-md">
                    Location
                  </label>
                  <LocationInput onLocationChange={handleLocationChange} />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => isComplete && !questStarted && !isGenerating ? handleInitiateQuest() : undefined}
                disabled={!isComplete || questStarted || isGenerating}
                className={`${isComplete && !questStarted && !isGenerating ? 'mystical-quest-ready' : ''} transition-all duration-500 font-bold`}
                style={{ 
                  padding: '16px 32px',
                  backgroundColor: questStarted || isGenerating ? '#9CA3AF' : '#0891b2',
                  color: 'white',
                  backgroundImage: 'none'
                }}
              >
                {isGenerating ? 'Generating Quest...' : questStarted ? 'Quest Generated!' : 'Generate Quest'}
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                onClick={handleMakeYourOwn}
                disabled={!options.location || questStarted || isGenerating}
                className="transition-all duration-500 font-bold"
                style={{ 
                  padding: '16px 32px',
                  borderColor: '#22d3ee',
                  color: options.location && !questStarted && !isGenerating ? '#22d3ee' : '#9CA3AF',
                  backgroundColor: 'transparent'
                }}
              >
                Make Your Own Quest
              </Button>
            </div>

          </div>

        </div>
      </Container>

      {/* Safety Disclaimer Modal */}
      <SafetyDisclaimerModal
        isOpen={showSafetyDisclaimer}
        onAccept={handleSafetyAccepted}
        onDecline={handleSafetyDeclined}
      />

      {/* Quest Confirmation Modal */}
      <QuestConfirmationModal
        isOpen={showQuestConfirmation}
        onConfirm={handleQuestConfirmed}
        onCancel={handleQuestCancelled}
      />
    </div>
  );
}