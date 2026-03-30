import Dexie from 'dexie';

// Create and configure the IndexedDB database using Dexie
const db = new Dexie('LocationJournalDB');

db.version(1).stores({
  // id: auto-incremented primary key
  // title, notes, lat, lng, address, photo, createdAt, updatedAt are indexed/stored
  entries: '++id, createdAt',
});

export default db;
