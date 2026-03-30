import { useState, useEffect } from 'react';
import db from './db';
import EntryCard from './components/EntryCard';
import EntryForm from './components/EntryForm';
import EntryDetail from './components/EntryDetail';
import './App.css';

/**
 * App — root component managing the view state and all CRUD operations.
 *
 * Views:
 *   'list'   → entry list (home)
 *   'new'    → create new entry form
 *   'edit'   → edit existing entry form
 *   'detail' → full entry view
 */
export default function App() {
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState('list');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  // Load all entries from IndexedDB on mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Capture the PWA install prompt event so we can show an Install button
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ── CRUD operations ───────────────────────────────────────────────────────

  const loadEntries = async () => {
    const all = await db.entries.orderBy('createdAt').reverse().toArray();
    setEntries(all);
  };

  const handleCreate = async (data) => {
    const now = new Date().toISOString();
    await db.entries.add({ ...data, createdAt: now, updatedAt: now });
    await loadEntries();
    setView('list');
  };

  const handleUpdate = async (data) => {
    const now = new Date().toISOString();
    await db.entries.update(selectedEntry.id, { ...data, updatedAt: now });
    await loadEntries();
    setView('list');
    setSelectedEntry(null);
  };

  const handleDelete = async (id) => {
    await db.entries.delete(id);
    await loadEntries();
    if (view === 'detail') setView('list');
  };

  // ── Navigation helpers ────────────────────────────────────────────────────

  const openNew = () => {
    setSelectedEntry(null);
    setView('new');
  };

  const openEdit = (entry) => {
    setSelectedEntry(entry);
    setView('edit');
  };

  const openDetail = (entry) => {
    setSelectedEntry(entry);
    setView('detail');
  };

  const goHome = () => {
    setSelectedEntry(null);
    setView('list');
  };

  // ── PWA install ───────────────────────────────────────────────────────────

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  // ── Search filter ─────────────────────────────────────────────────────────
  const filteredEntries = entries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.notes && e.notes.toLowerCase().includes(q)) ||
      (e.location && e.location.address.toLowerCase().includes(q))
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      {/* App Shell Header */}
      <header className="app-header">
        <div className="app-header__inner">
          {view !== 'list' ? (
            <button className="btn-back" onClick={goHome}>← Home</button>
          ) : (
            <div className="app-brand">
              <span className="app-logo">🗺️</span>
              <span className="app-name">Location Journal</span>
            </div>
          )}

          <div className="header-actions">
            {installPrompt && (
              <button className="btn btn-outline btn-sm" onClick={handleInstall}>
                ⬇ Install App
              </button>
            )}
            {view === 'list' && (
              <button className="btn btn-primary" onClick={openNew}>
                + New Entry
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div className="list-toolbar">
              <input
                type="search"
                className="search-input"
                placeholder="🔍 Search entries…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {entries.length > 0 && (
                <p className="entry-count">{filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}</p>
              )}
            </div>

            {filteredEntries.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? (
                  <>
                    <p className="empty-state__icon">🔍</p>
                    <p>No entries match &quot;{searchQuery}&quot;</p>
                  </>
                ) : (
                  <>
                    <p className="empty-state__icon">🌍</p>
                    <h2>Your journal is empty</h2>
                    <p>Tap <strong>+ New Entry</strong> to start capturing moments and places.</p>
                    <button className="btn btn-primary" onClick={openNew}>
                      + Add Your First Entry
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="entry-list">
                {filteredEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onClick={openDetail}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* NEW ENTRY FORM */}
        {view === 'new' && (
          <div className="form-container">
            <h1 className="form-title">New Entry</h1>
            <EntryForm onSave={handleCreate} onCancel={goHome} />
          </div>
        )}

        {/* EDIT FORM */}
        {view === 'edit' && selectedEntry && (
          <div className="form-container">
            <h1 className="form-title">Edit Entry</h1>
            <EntryForm
              initialData={selectedEntry}
              onSave={handleUpdate}
              onCancel={goHome}
            />
          </div>
        )}

        {/* DETAIL VIEW */}
        {view === 'detail' && selectedEntry && (
          <EntryDetail
            entry={selectedEntry}
            onEdit={openEdit}
            onClose={goHome}
          />
        )}
      </main>

      {/* Floating Action Button (mobile) */}
      {view === 'list' && (
        <button className="fab" onClick={openNew} aria-label="New entry">
          +
        </button>
      )}
    </div>
  );
}
