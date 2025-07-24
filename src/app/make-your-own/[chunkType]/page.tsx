"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Card, Loading } from '@/components/ui';

interface LocationResult {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
  url?: string;
  phone?: string;
  directions?: string;
  type: string;
  distance?: number;
  rating?: number;
  priceLevel?: string;
  hours?: string;
}

interface ChunkApiResponse {
  success: boolean;
  chunkType: string;
  locations: LocationResult[];
  count: number;
  error?: string;
}

export default function ChunkResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chunkInfo, setChunkInfo] = useState<{ name: string; type: string } | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const chunkType = params.chunkType as string;

  useEffect(() => {
    // Get location from URL params
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const locationName = searchParams.get('location');
    
    if (lat && lng && locationName) {
      setLocationInfo({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name: decodeURIComponent(locationName)
      });
    }

    // Set chunk info
    setChunkInfo({
      name: getChunkDisplayName(chunkType),
      type: chunkType
    });

    // Fetch locations from the API
    const fetchLocations = async () => {
      if (!lat || !lng) {
        setError('Missing location parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/chunks/${chunkType}?lat=${lat}&lng=${lng}&radius=25&limit=20`
        );
        
        const data: ChunkApiResponse = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch locations');
        }
        
        setLocations(data.locations);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [chunkType, searchParams]);

  const getChunkDisplayName = (type: string): string => {
    const names: Record<string, string> = {
      obscura: 'Atlas Obscura',
      hiking: 'Hiking Trails',
      beach: 'Beaches',
      google_beach: 'Google Beaches',
      google_hiking: 'Google Hiking Areas',
      google_marina: 'Google Marinas',
      google_observation_deck: 'Google Observation Decks',
      google_psychic: 'Google Psychic Places',
      google_japanese_inn: 'Google Japanese Inns',
      google_cat_cafe: 'Google Cat Cafes',
      google_offroading: 'Google Off-roading',
      skateboard_park: 'Skateboard Parks',
      national_park: 'National Parks',
      wind_generator: 'Wind Generators',
      mountain: 'Mountains',
      lighthouse: 'Lighthouses',
      pier: 'Piers'
    };
    
    return names[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleGetDirections = (location: LocationResult) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const handleViewDetails = (location: LocationResult) => {
    if (location.url) {
      window.open(location.url, '_blank');
    } else {
      // Fallback to Google Maps search
      const searchQuery = encodeURIComponent(location.title + ' ' + location.location);
      const url = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] flex items-center justify-center">
        <Loading className="text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)]">
        <Container size="sm" className="py-8">
          <div className="text-center space-y-4">
            <h1 className="text-white text-3xl font-bold">Error Loading Locations</h1>
            <p className="text-red-300">{error}</p>
            <div className="space-x-4">
              <Link href={`/make-your-own?lat=${locationInfo?.lat}&lng=${locationInfo?.lng}&location=${encodeURIComponent(locationInfo?.name || '')}`}>
                <Button variant="secondary">Try Different Type</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Go Home</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)]">
      <Container size="lg" className="py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  ← Home
                </Button>
              </Link>
              <Link href={`/make-your-own?lat=${locationInfo?.lat}&lng=${locationInfo?.lng}&location=${encodeURIComponent(locationInfo?.name || '')}`}>
                <Button variant="outline" size="sm">
                  ← All Types
                </Button>
              </Link>
            </div>
            
            <h1 className="text-display text-4xl lg:text-5xl font-bold text-white">
              {chunkInfo?.name} <span className="text-cyan-400">Locations</span>
            </h1>
            
            {locationInfo && (
              <p className="text-cyan-200 text-lg">
                Near: <span className="font-semibold">{locationInfo.name}</span>
              </p>
            )}
            
            <p className="text-cyan-300 text-sm">
              Found {locations.length} location{locations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Results */}
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <Card key={location.id} className="p-6 bg-black/60 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-white text-lg font-bold line-clamp-2">
                        {location.title}
                      </h3>
                      
                      {location.distance && (
                        <p className="text-cyan-400 text-sm font-medium">
                          {location.distance} miles away
                        </p>
                      )}
                      
                      {location.rating && (
                        <p className="text-yellow-400 text-sm">
                          ★ {location.rating}/5
                        </p>
                      )}
                    </div>
                    
                    <p className="text-cyan-200 text-sm line-clamp-3">
                      {location.description}
                    </p>
                    
                    <p className="text-gray-300 text-xs">
                      {location.location}
                    </p>
                    
                    {location.phone && (
                      <p className="text-gray-400 text-xs">
                        ☎ {location.phone}
                      </p>
                    )}
                    
                    {location.hours && (
                      <p className="text-gray-400 text-xs">
                        {location.hours}
                      </p>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleGetDirections(location)}
                        className="flex-1"
                      >
                        Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(location)}
                        className="flex-1"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-white text-2xl font-bold">No Locations Found</h2>
              <p className="text-cyan-200">
                No {chunkInfo?.name.toLowerCase()} locations were found near {locationInfo?.name}.
              </p>
              <p className="text-cyan-300 text-sm">
                Try selecting a different location type or expanding your search area.
              </p>
              <Link href={`/make-your-own?lat=${locationInfo?.lat}&lng=${locationInfo?.lng}&location=${encodeURIComponent(locationInfo?.name || '')}`}>
                <Button variant="secondary">Try Different Type</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}