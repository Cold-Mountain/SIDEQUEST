"use client";

import * as React from "react";
import { Button } from "./button";
import { Card } from "./card";

interface TravelInfo {
  duration: string; // e.g., "25 mins"
  durationValue: number; // in seconds
  distance: string; // e.g., "15.2 km"
  distanceValue: number; // in meters
}

interface DirectionsInfo {
  origin: string;
  destination: string;
  travelInfo: TravelInfo;
  directionsUrl: string;
  embedMapUrl: string;
}

interface QuestMapProps {
  directionsInfo: DirectionsInfo;
  questLocationName?: string;
  className?: string;
}

export function QuestMap({ directionsInfo, questLocationName, className }: QuestMapProps) {
  const [showMap, setShowMap] = React.useState(false);
  const [mapLoaded, setMapLoaded] = React.useState(false);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleDirectionsClick = () => {
    window.open(directionsInfo.directionsUrl, '_blank');
  };

  return (
    <div className={className}>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            🚗 Travel Information
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-secondary)]">
              {directionsInfo.travelInfo.duration}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {directionsInfo.travelInfo.distance}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">From:</span>
            <span className="text-[var(--color-text-primary)]">Your location</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">To:</span>
            <span className="text-[var(--color-text-primary)]">
              {questLocationName || "Quest location"}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDirectionsClick}
            className="flex-1"
          >
            Open in Google Maps
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="flex-1"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {/* Embedded Map */}
        {showMap && directionsInfo.embedMapUrl && (
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden border border-[var(--color-border)]">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]">
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-secondary)] mx-auto"></div>
                    <p className="text-sm text-[var(--color-text-muted)]">Loading map...</p>
                  </div>
                </div>
              )}
              <iframe
                src={directionsInfo.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={handleMapLoad}
                title="Quest Directions Map"
              />
            </div>
            <div className="mt-2 text-xs text-[var(--color-text-muted)] text-center">
              Interactive map powered by Google Maps
            </div>
          </div>
        )}

        {/* Travel Tips */}
        <div className="pt-3 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            💡 Travel time may vary based on traffic conditions. Consider checking live traffic before departing.
          </p>
        </div>
      </Card>
    </div>
  );
}

// Skeleton component for loading state
export function QuestMapSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="text-right space-y-1">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-8 flex-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 flex-1 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </Card>
    </div>
  );
}