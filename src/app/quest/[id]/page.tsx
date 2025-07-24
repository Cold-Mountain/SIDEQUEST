"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { LoadingScreen, ErrorFallback, QuestMap, QuestMapSkeleton } from '@/components/ui';
import { EnhancedQuest } from '@/lib/gemini';
import { getQuestDirections, isGoogleMapsAvailable } from '@/lib/googleMapsService';
import { ChunkLocation } from '@/types/database';

interface DirectionsInfo {
  origin: string;
  destination: string;
  travelInfo: {
    duration: string;
    durationValue: number;
    distance: string;
    distanceValue: number;
  };
  directionsUrl: string;
  embedMapUrl: string;
}

// Function to get readable source name from chunk type
function getChunkSourceName(chunkType: string): string {
  const sourceMap: Record<string, string> = {
    // Atlas Obscura
    'obscura': 'Atlas Obscura',
    
    // GeoApify-based chunks
    'beach': 'GeoApify',
    'national_park': 'GeoApify',
    'wind_generator': 'GeoApify', 
    'mountain': 'GeoApify',
    'lighthouse': 'GeoApify',
    'pier': 'GeoApify',
    
    // Google Places chunks
    'skateboard_park': 'Google Places',
    'google_hiking_area': 'Google Places',
    'google_beach': 'Google Places',
    'google_marina': 'Google Places',
    'google_observation_deck': 'Google Places',
    'google_psychic': 'Google Places',
    'google_japanese_inn': 'Google Places',
    'google_cat_cafe': 'Google Places',
    'google_off_roading': 'Google Places',
    
    // OpenStreetMap trails
    'hiking': 'OpenStreetMap',
    'trail': 'OpenStreetMap'
  };
  
  return sourceMap[chunkType] || 'Location Service';
}

// Function to get emoji for chunk type
function getChunkEmoji(chunkType: string): string {
  const emojiMap: Record<string, string> = {
    'obscura': '🗺️',
    'beach': '🏖️',
    'google_beach': '🏖️', 
    'national_park': '🏞️',
    'wind_generator': '💨',
    'mountain': '⛰️',
    'lighthouse': '🗼',
    'pier': '🌊',
    'skateboard_park': '🛹',
    'google_hiking_area': '🥾',
    'google_marina': '⛵',
    'google_observation_deck': '🔭',
    'google_psychic': '🔮',
    'google_japanese_inn': '🏯',
    'google_cat_cafe': '🐱',
    'google_off_roading': '🚙',
    'hiking': '🥾',
    'trail': '🥾'
  };
  
  return emojiMap[chunkType] || '📍';
}

export default function QuestPage() {
  const params = useParams();
  const questId = params.id as string;
  
  const [quest, setQuest] = useState<EnhancedQuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directionsInfo, setDirectionsInfo] = useState<DirectionsInfo | null>(null);
  const [loadingDirections, setLoadingDirections] = useState(false);

  // Function to fetch directions info for journey theme users
  const fetchDirectionsInfo = async (questData: EnhancedQuest) => {
    // Check if conditions are met for showing directions
    const isJourneyTheme = questData.userInputs.theme === 'adventure';
    const hasUserLocation = questData.userInputs.location?.latitude && questData.userInputs.location?.longitude;
    
    // Check if we have either Atlas Obscura or RIDB trail location
    const hasAtlasLocation = questData.atlasLocation?.lat && questData.atlasLocation?.lng;
    const hasTrailLocation = questData.trailLocation?.lat && questData.trailLocation?.lng;
    const hasQuestLocation = hasAtlasLocation || hasTrailLocation;
    
    const mapsAvailable = await isGoogleMapsAvailable();

    if (!isJourneyTheme || !hasUserLocation || !hasQuestLocation || !mapsAvailable) {
      console.log('Skipping directions fetch:', { 
        isJourneyTheme, 
        hasUserLocation, 
        hasAtlasLocation,
        hasTrailLocation,
        hasQuestLocation, 
        mapsAvailable 
      });
      return;
    }

    const locationName = questData.atlasLocation?.title || questData.trailLocation?.title || 'Quest Location';
    console.log('Fetching directions for quest location:', locationName);

    setLoadingDirections(true);
    try {
      // Get coordinates from either Atlas Obscura or RIDB trail location
      const destinationLat = questData.atlasLocation?.lat || questData.trailLocation?.lat || 0;
      const destinationLng = questData.atlasLocation?.lng || questData.trailLocation?.lng || 0;
      
      const directions = await getQuestDirections(
        questData.userInputs.location!.latitude,
        questData.userInputs.location!.longitude,
        destinationLat,
        destinationLng,
        locationName
      );

      if (directions) {
        setDirectionsInfo(directions);
      }
    } catch (err) {
      console.error('Error fetching directions:', err);
    } finally {
      setLoadingDirections(false);
    }
  };

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const response = await fetch(`/api/quest/${questId}`);
        const result = await response.json();
        
        if (result.success) {
          setQuest(result.quest);
          // After quest is loaded, fetch directions if conditions are met
          await fetchDirectionsInfo(result.quest);
        } else {
          setError(result.error || 'Quest not found');
        }
      } catch (err) {
        console.error('Error fetching quest:', err);
        setError('Failed to load quest');
      } finally {
        setLoading(false);
      }
    };

    if (questId) {
      fetchQuest();
    }
  }, [questId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !quest) {
    return <ErrorFallback error={new Error(error || 'Quest not found')} resetError={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-20 dynamic-background relative">
      <div className="floating-elements"></div>
      <Container>
        <Section>
          <div className="max-w-4xl mx-auto stagger-animation">
            <div className="text-center mb-8 fade-in">
              <div className="flex justify-center gap-4 text-sm mb-4">
                <span className="px-4 py-2 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20 font-medium text-[var(--color-primary)] hover-scale">
                  {quest.difficulty.toUpperCase()}
                </span>
                <span className="px-4 py-2 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20 font-medium text-[var(--color-primary)] hover-scale">
                  {quest.timeframe.toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 blur-in">
                Your Quest Has Been Forged
              </h1>
              <p className="text-[var(--color-text-muted)] slide-up">
                The ancient forces have spoken. Your destiny awaits.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 mb-8 interactive-card hover-lift scale-in mystical-border">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4 text-heading-2">
                Your Quest
              </h2>
              <div className="relative">
                <p className="text-lg text-[var(--color-text-primary)] leading-relaxed text-body-large">
                  {quest.description}
                </p>
                <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
              </div>
            </div>

            {/* Atlas Obscura Location Card */}
            {quest.atlasLocation && (
              <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-6 mb-6 interactive-card hover-lift bounce-in shadow-md">
                <div className="flex items-start gap-4">
                  <div className="text-4xl animate-pulse">🗺️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 text-heading-3">
                      Featured Location
                    </h3>
                    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                      {quest.atlasLocation.title}
                    </h4>
                    {quest.atlasLocation.subtitle && (
                      <p className="text-[var(--color-text-secondary)] mb-3 italic">
                        {quest.atlasLocation.subtitle}
                      </p>
                    )}
                    <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed text-body">
                      {quest.atlasLocation.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-full text-sm hover-scale font-medium">
                        📊 Atlas Obscura
                      </span>
                      {quest.atlasLocation.location && (
                        <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-full text-sm hover-scale font-medium">
                          📍 {quest.atlasLocation.location}
                        </span>
                      )}
                    </div>
                    {quest.atlasLocation.url && (
                      <a 
                        href={quest.atlasLocation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-lg transition-all duration-300 hover-scale shadow-lg"
                      >
                        <span>Learn More</span>
                        <span className="text-sm transition-transform group-hover:translate-x-1">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* RIDB Trail Location Card */}
            {quest.trailLocation && (
              <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-6 mb-6 interactive-card hover-lift bounce-in shadow-md">
                <div className="flex items-start gap-4">
                  <div className="text-4xl animate-pulse">🥾</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 text-heading-3">
                      Trail Location
                    </h3>
                    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                      {quest.trailLocation.title}
                    </h4>
                    <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed text-body">
                      {quest.trailLocation.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-full text-sm hover-scale font-medium">
                        📊 {getChunkSourceName(quest.trailLocation.type)}
                      </span>
                      <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-full text-sm hover-scale font-medium">
                        🥾 Hiking Trail
                      </span>
                      {quest.trailLocation.location && (
                        <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-full text-sm hover-scale font-medium">
                          📍 {quest.trailLocation.location}
                        </span>
                      )}
                    </div>
                    {quest.trailLocation.directions && (
                      <div className="mb-4 p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                          <strong>Directions:</strong> {quest.trailLocation.directions}
                        </p>
                      </div>
                    )}
                    {quest.trailLocation.phone && (
                      <div className="mb-4">
                        <a 
                          href={`tel:${quest.trailLocation.phone}`}
                          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors"
                        >
                          📞 {quest.trailLocation.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Chunk Locations */}
            {quest.chunkLocations && quest.chunkLocations.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 text-heading-3">
                  Additional Locations
                </h3>
                {quest.chunkLocations.map((location, index) => (
                  <div key={location.id} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-6 interactive-card hover-lift bounce-in shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl animate-pulse">{getChunkEmoji(location.type)}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                          {location.title}
                        </h4>
                        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed text-body">
                          {location.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-full text-sm hover-scale font-medium">
                            📊 {getChunkSourceName(location.type)}
                          </span>
                          {location.location && (
                            <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-full text-sm hover-scale font-medium">
                              📍 {location.location}
                            </span>
                          )}
                          {location.rating && (
                            <span className="px-3 py-1 bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20 rounded-full text-sm hover-scale font-medium">
                              ⭐ {location.rating}/5
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {location.url && (
                            <a 
                              href={location.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-lg transition-all duration-300 hover-scale shadow-lg"
                            >
                              <span>Learn More</span>
                              <span className="text-sm transition-transform group-hover:translate-x-1">↗</span>
                            </a>
                          )}
                          {location.phone && (
                            <a 
                              href={`tel:${location.phone}`}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors border border-[var(--color-primary)]/20"
                            >
                              📞 {location.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Travel Directions - Show for adventure theme users with Maps API available */}
            {quest.userInputs.theme === 'adventure' && (
              <div className="mb-6">
                {loadingDirections ? (
                  <QuestMapSkeleton />
                ) : directionsInfo ? (
                  <QuestMap 
                    directionsInfo={directionsInfo}
                    questLocationName={quest.atlasLocation?.title || quest.trailLocation?.title}
                  />
                ) : null}
              </div>
            )}

            <div className="text-center mt-8 fade-in">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl transition-all duration-300 hover-lift shadow-lg transform hover:scale-105"
              >
                Generate Another Quest
              </button>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}