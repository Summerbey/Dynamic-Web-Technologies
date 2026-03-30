import { useState } from 'react';

/**
 * LocationCapture component
 * Uses the Geolocation API (navigator.geolocation) to get the user's current position.
 * Stores lat/lng and attempts reverse geocoding via the free Nominatim API.
 */
export default function LocationCapture({ location, onLocationCapture }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError('');

    // Success handler — shared by both high-accuracy and fallback attempts
    const onSuccess = async (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      // Attempt reverse geocoding with Nominatim (OpenStreetMap, no API key needed)
      let address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'LocationJournalApp/1.0',
            },
            signal: controller.signal,
          }
        );
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          if (data.display_name) address = data.display_name;
        }
      } catch {
        // Geocoding failed — coordinates already set as fallback address
      }

      onLocationCapture({ lat: latitude, lng: longitude, accuracy, address });
      setLoading(false);
    };

    const onError = (err) => {
      // If high-accuracy times out (code 3), retry once with low-accuracy
      if (err.code === 3) {
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          () => {
            setError('Location unavailable. Make sure location is enabled on your device.');
            setLoading(false);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
        );
        return;
      }
      const messages = {
        1: 'Location access denied. Please allow location permissions in your browser settings.',
        2: 'Location unavailable. Make sure location is enabled on your device.',
      };
      setError(messages[err.code] || 'Could not get location. Please try again.');
      setLoading(false);
    };

    // First try: high accuracy (GPS), 15 second timeout
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  };

  const clearLocation = () => {
    onLocationCapture(null);
    setError('');
  };

  return (
    <div className="location-capture">
      {location ? (
        <div className="location-result">
          <div className="location-info">
            <span className="location-icon">📍</span>
            <div>
              <p className="location-address">{location.address}</p>
              <p className="location-coords">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                {location.accuracy && ` (±${Math.round(location.accuracy)}m)`}
              </p>
            </div>
          </div>
          <div className="location-actions">
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              View Map
            </a>
            <button type="button" className="btn btn-secondary btn-sm" onClick={captureLocation} disabled={loading}>
              {loading ? 'Getting location…' : 'Update'}
            </button>
            <button type="button" className="btn-icon" onClick={clearLocation} title="Remove location">
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-outline" onClick={captureLocation} disabled={loading}>
          {loading ? (
            <span>📡 Getting location…</span>
          ) : (
            <span>📍 Tag Location</span>
          )}
        </button>
      )}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
