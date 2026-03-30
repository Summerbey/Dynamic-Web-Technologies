/**
 * EntryDetail — full-screen view of a single journal entry.
 */
export default function EntryDetail({ entry, onEdit, onClose }) {
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = new Date(entry.createdAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="entry-detail">
      <div className="entry-detail__header">
        <button className="btn-back" onClick={onClose}>← Back</button>
        <button className="btn btn-outline btn-sm" onClick={() => onEdit(entry)}>Edit</button>
      </div>

      {entry.photo && (
        <div className="entry-detail__photo">
          <img src={entry.photo} alt={entry.title} />
        </div>
      )}

      <div className="entry-detail__content">
        <div className="entry-detail__meta">
          <span className="entry-mood entry-mood--lg">{entry.mood}</span>
          <div>
            <p className="entry-date">{formattedDate}</p>
            <p className="entry-time">{formattedTime}</p>
          </div>
        </div>

        <h1 className="entry-detail__title">{entry.title}</h1>

        {entry.notes && (
          <p className="entry-detail__notes">{entry.notes}</p>
        )}

        {entry.location && (
          <div className="entry-detail__location">
            <h3>📍 Location</h3>
            <p>{entry.location.address}</p>
            <p className="location-coords">
              {entry.location.lat.toFixed(5)}, {entry.location.lng.toFixed(5)}
              {entry.location.accuracy && ` (±${Math.round(entry.location.accuracy)}m)`}
            </p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${entry.location.lat}&mlon=${entry.location.lng}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Open in Map
            </a>
          </div>
        )}

        {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
          <p className="entry-detail__updated">
            Last edited: {new Date(entry.updatedAt).toLocaleString('en-GB')}
          </p>
        )}
      </div>
    </div>
  );
}
