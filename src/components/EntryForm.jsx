import { useState, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import LocationCapture from './LocationCapture';

/**
 * EntryForm — used for both creating new entries and editing existing ones.
 * Props:
 *  - initialData: entry object to pre-fill (for edit mode), or null for new
 *  - onSave(entryData): called with the form data when submitted
 *  - onCancel(): called when the user discards the form
 */
export default function EntryForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('😊');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const MOODS = ['😊', '😄', '😐', '😔', '😠', '😍', '🤔', '😴'];

  // Pre-fill form when editing an existing entry
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setNotes(initialData.notes || '');
      setMood(initialData.mood || '😊');
      setPhoto(initialData.photo || null);
      setLocation(initialData.location || null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      notes: notes.trim(),
      mood,
      photo,
      location,
    });
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-group">
        <label htmlFor="entry-title">Title *</label>
        <input
          id="entry-title"
          type="text"
          className="form-input"
          placeholder="Give this moment a name…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      {/* Mood picker */}
      <div className="form-group">
        <label>Mood</label>
        <div className="mood-picker">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`mood-btn ${mood === m ? 'mood-btn--active' : ''}`}
              onClick={() => setMood(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="entry-notes">Notes</label>
        <textarea
          id="entry-notes"
          className="form-textarea"
          placeholder="What's happening? Write your thoughts…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          maxLength={2000}
        />
        <span className="char-count">{notes.length}/2000</span>
      </div>

      {/* Photo — Camera API */}
      <div className="form-group">
        <label>Photo</label>
        <CameraCapture currentPhoto={photo} onCapture={setPhoto} />
      </div>

      {/* Location — Geolocation API */}
      <div className="form-group">
        <label>Location</label>
        <LocationCapture location={location} onLocationCapture={setLocation} />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
          {initialData ? 'Save Changes' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
}
