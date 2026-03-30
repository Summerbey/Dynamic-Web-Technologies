/**
 * EntryCard — displays a single journal entry in the list.
 * Props:
 *  - entry: the journal entry object
 *  - onEdit(entry): called when Edit is clicked
 *  - onDelete(id): called when Delete is clicked
 *  - onClick(entry): called when the card body is clicked (expand view)
 */
export default function EntryCard({ entry, onEdit, onDelete, onClick }) {
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = new Date(entry.createdAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${entry.title}"? This cannot be undone.`)) {
      onDelete(entry.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(entry);
  };

  return (
    <article className="entry-card" onClick={() => onClick(entry)}>
      {/* Thumbnail */}
      {entry.photo && (
        <div className="entry-card__photo">
          <img src={entry.photo} alt={entry.title} />
        </div>
      )}

      <div className="entry-card__body">
        <div className="entry-card__header">
          <span className="entry-mood">{entry.mood}</span>
          <div className="entry-meta">
            <span className="entry-date">{formattedDate}</span>
            <span className="entry-time">{formattedTime}</span>
          </div>
        </div>

        <h2 className="entry-card__title">{entry.title}</h2>

        {entry.notes && (
          <p className="entry-card__notes">
            {entry.notes.length > 120 ? entry.notes.slice(0, 120) + '…' : entry.notes}
          </p>
        )}

        {entry.location && (
          <div className="entry-card__location">
            <span>📍</span>
            <span className="location-snippet">
              {entry.location.address.length > 60
                ? entry.location.address.slice(0, 60) + '…'
                : entry.location.address}
            </span>
          </div>
        )}
      </div>

      <div className="entry-card__actions">
        <button className="btn-icon" onClick={handleEdit} title="Edit entry" aria-label="Edit">
          ✏️
        </button>
        <button className="btn-icon btn-icon--danger" onClick={handleDelete} title="Delete entry" aria-label="Delete">
          🗑️
        </button>
      </div>
    </article>
  );
}
