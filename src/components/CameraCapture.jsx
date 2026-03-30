import { useRef, useState, useCallback } from 'react';

/**
 * CameraCapture component
 * Uses the MediaDevices Camera API (getUserMedia) for live preview on desktop,
 * and falls back to <input capture> for mobile PWA contexts.
 */
export default function CameraCapture({ onCapture, currentPhoto }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [mode, setMode] = useState('idle'); // 'idle' | 'live' | 'preview'
  const [error, setError] = useState('');

  // Start the live camera stream using getUserMedia
  const startCamera = useCallback(async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // rear camera on mobile
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode('live');
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or use the file picker below.');
    }
  }, []);

  // Stop the camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setMode('idle');
  }, []);

  // Capture a still frame from the live video stream
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCapture(dataUrl);
    stopCamera();
    setMode('preview');
  }, [onCapture, stopCamera]);

  // Handle file picker fallback (works great on mobile PWA)
  const handleFilePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onCapture(ev.target.result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    onCapture(null);
    setMode('idle');
  };

  return (
    <div className="camera-capture">
      {/* Show current photo preview if one exists */}
      {currentPhoto && mode !== 'live' && (
        <div className="photo-preview">
          <img src={currentPhoto} alt="Captured" />
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleRetake}>
            Retake Photo
          </button>
        </div>
      )}

      {/* Live camera view */}
      {mode === 'live' && (
        <div className="live-camera">
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <div className="camera-controls">
            <button type="button" className="btn btn-primary" onClick={capturePhoto}>
              📸 Capture
            </button>
            <button type="button" className="btn btn-secondary" onClick={stopCamera}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas used for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Controls shown when not in live mode and no photo yet */}
      {!currentPhoto && mode !== 'live' && (
        <div className="camera-options">
          <button type="button" className="btn btn-outline" onClick={startCamera}>
            📷 Open Camera
          </button>
          <span className="divider-text">or</span>
          <label className="btn btn-outline file-label">
            🖼️ Choose from Gallery
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFilePick}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
