"use client";

import * as React from "react";
import { Button, Input } from "@/components/ui";
import { getLocationWithFallback, getLocationByGPS, geocodeLocation, createManualLocation, formatLocation, reverseGeocode } from "@/lib/locationService";
import type { Location, LocationResult } from "@/types/location";

interface LocationInputProps {
  onLocationChange: (location: Location | null) => void;
  className?: string;
}

export function LocationInput({ onLocationChange, className }: LocationInputProps) {
  const [location, setLocation] = React.useState<Location | null>(null);
  const [isDetecting, setIsDetecting] = React.useState(false);
  const [showManualInput, setShowManualInput] = React.useState(false);
  const [manualCity, setManualCity] = React.useState("");
  const [manualState, setManualState] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Auto-detect location on mount
  React.useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setIsDetecting(true);
    setError(null);

    try {
      const result: LocationResult = await getLocationWithFallback();
      
      if (result.location) {
        setLocation(result.location);
        onLocationChange(result.location);
      } else {
        setError(result.error || "Could not detect location");
        setShowManualInput(true);
      }
    } catch (err) {
      setError("Failed to detect location");
      setShowManualInput(true);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualCity.trim()) return;

    setIsDetecting(true);
    setError(null);

    try {
      // Try geocoding first
      const result = await geocodeLocation(manualCity, manualState);
      
      if (result.location) {
        setLocation(result.location);
        onLocationChange(result.location);
        setShowManualInput(false);
        setError(null);
      } else {
        // Fallback to basic manual location if geocoding fails
        const fallback = createManualLocation(manualCity, manualState);
        if (fallback.location) {
          setLocation(fallback.location);
          onLocationChange(fallback.location);
          setShowManualInput(false);
          setError("Location set, but coordinates unavailable");
        }
      }
    } catch (err) {
      setError("Failed to find location");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleEditLocation = () => {
    setShowManualInput(true);
    if (location) {
      setManualCity(location.city || "");
      setManualState(location.state || "");
    }
  };

  const handleGetPreciseLocation = async () => {
    setIsDetecting(true);
    setError(null);

    try {
      const result = await getLocationByGPS();
      
      if (result.location) {
        // Get the actual city/state name for the GPS coordinates
        const addressInfo = await reverseGeocode(
          result.location.latitude, 
          result.location.longitude
        );
        
        // Create precise location with GPS coordinates and reverse geocoded address
        const preciseLocation: Location = {
          latitude: result.location.latitude,
          longitude: result.location.longitude,
          accuracy: result.location.accuracy,
          city: addressInfo.city || location?.city,
          state: addressInfo.state || location?.state,
          country: addressInfo.country || location?.country,
          zip: addressInfo.zip || location?.zip
        };
        
        setLocation(preciseLocation);
        onLocationChange(preciseLocation);
      } else {
        setError(result.error || "Could not get precise location");
      }
    } catch (err) {
      setError("Failed to get precise location");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Location Display */}
        {location && !showManualInput && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Current Location
                </p>
                <p className="text-base text-[var(--color-text-secondary)]">
                  {formatLocation(location)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEditLocation}
              >
                Edit
              </Button>
            </div>
            
            {/* Precise Location Button - only show if current location is IP-based (low accuracy) */}
            {location.accuracy && location.accuracy > 1000 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetPreciseLocation}
                disabled={isDetecting}
                loading={isDetecting}
                className="w-full"
              >
                {isDetecting ? "Getting Precise Location..." : "Get Precise Location (GPS)"}
              </Button>
            )}
          </div>
        )}

        {/* Manual Input Form */}
        {showManualInput && (
          <div className="space-y-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
                Enter Your Location
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="City (required)"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="State/Province (optional)"
                  value={manualState}
                  onChange={(e) => setManualState(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleManualSubmit}
                disabled={!manualCity.trim() || isDetecting}
                loading={isDetecting}
                className="flex-1"
              >
                {isDetecting ? "Finding Location..." : "Set Location"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManualInput(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Auto-detect Controls */}
        {!location && !showManualInput && (
          <div className="space-y-3">
            <Button
              variant="primary"
              size="default"
              onClick={detectLocation}
              disabled={isDetecting}
              loading={isDetecting}
              className="w-full"
            >
              {isDetecting ? "Detecting Location..." : "Detect My Location"}
            </Button>
            
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowManualInput(true)}
              className="w-full"
            >
              Enter Location Manually
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Location Source Info */}
        {location && (
          <p className="text-xs text-[var(--color-text-muted)] text-center">
            Location detected via {location.accuracy && location.accuracy < 1000 ? 'GPS' : 'IP address'}
            {location.accuracy && ` (±${Math.round(location.accuracy)}m accuracy)`}
          </p>
        )}
      </div>
    </div>
  );
}