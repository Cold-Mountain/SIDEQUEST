"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Card } from '@/components/ui';

interface ChunkInfo {
  name: string;
  type: string;
  weight: number;
  description: string;
  enabled: boolean;
}

interface ChunksApiResponse {
  success: boolean;
  chunks: ChunkInfo[];
  totalChunks: number;
  enabledChunks: number;
  error?: string;
}

function MakeYourOwnContent() {
  const searchParams = useSearchParams();
  const [chunks, setChunks] = useState<ChunkInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    // Get location from URL params
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const locationName = searchParams.get('location');
    
    if (lat && lng && locationName) {
      setLocation({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name: decodeURIComponent(locationName)
      });
    }

    // Fetch available chunks from server-side API
    const fetchAvailableChunks = async () => {
      try {
        console.log('Fetching chunks from API...');
        const response = await fetch('/api/chunks/available');
        const data: ChunksApiResponse = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch chunks');
        }
        
        console.log(`Received ${data.enabledChunks}/${data.totalChunks} enabled chunks from API`);
        setChunks(data.chunks);
      } catch (error) {
        console.error('Error fetching chunks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableChunks();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] flex items-center justify-center">
        <div className="text-white text-xl">Loading available location types...</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] flex items-center justify-center">
        <Container size="sm">
          <div className="text-center space-y-4">
            <h1 className="text-white text-3xl font-bold">Location Required</h1>
            <p className="text-cyan-200">Please select a location from the main page first.</p>
            <Link href="/">
              <Button variant="secondary">Go Back</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const enabledChunks = chunks.filter(chunk => chunk.enabled);
  const disabledChunks = chunks.filter(chunk => !chunk.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)]">
      <Container size="lg" className="py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                ← Back to Main
              </Button>
            </Link>
            <h1 className="text-display text-4xl lg:text-5xl font-bold text-white">
              Make Your Own <span className="text-cyan-400">Quest</span>
            </h1>
            <p className="text-cyan-200 text-lg">
              Exploring near: <span className="font-semibold">{location.name}</span>
            </p>
            <p className="text-cyan-300 text-sm">
              Choose a location type to discover what&apos;s nearby
            </p>
          </div>

          {/* Available Chunks */}
          {enabledChunks.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-white text-2xl font-bold text-center">
                Available Location Types
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enabledChunks.map((chunk) => (
                  <Link
                    key={chunk.type}
                    href={`/make-your-own/${chunk.type}?lat=${location.lat}&lng=${location.lng}&location=${encodeURIComponent(location.name)}`}
                  >
                    <Card className="p-6 bg-black/60 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer hover:scale-105">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white text-lg font-bold">{chunk.name}</h3>
                          <span className="text-cyan-400 text-sm font-medium">
                            Weight: {chunk.weight}
                          </span>
                        </div>
                        <p className="text-cyan-200 text-sm">{chunk.description}</p>
                        <div className="flex justify-end">
                          <Button variant="secondary" size="sm">
                            Explore →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Disabled Chunks */}
          {disabledChunks.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-gray-400 text-xl font-bold text-center">
                Currently Unavailable
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disabledChunks.map((chunk) => (
                  <Card key={chunk.type} className="p-6 bg-black/30 border-gray-600/30 opacity-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-400 text-lg font-bold">{chunk.name}</h3>
                        <span className="text-gray-500 text-sm">
                          Disabled
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{chunk.description}</p>
                      <p className="text-gray-600 text-xs">
                        API key not configured or service unavailable
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {enabledChunks.length === 0 && (
            <div className="text-center space-y-4">
              <h2 className="text-white text-2xl font-bold">No Location Types Available</h2>
              <p className="text-cyan-200">
                It looks like no chunk APIs are currently configured. Please check your environment variables.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function MakeYourOwnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MakeYourOwnContent />
    </Suspense>
  );
}