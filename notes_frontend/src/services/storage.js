/**
 * Storage service that supports:
 * - Remote API via VITE_API_BASE or VITE_BACKEND_URL (optional)
 * - localStorage fallback for persistence in browser sessions
 * - In-memory fallback if neither is available
 *
 * Notes structure: { id: string, title: string, body: string, updatedAt: number, createdAt: number }
 */

// PUBLIC_INTERFACE
export function createStorage() {
  /** Create a storage API with CRUD methods: list, get, create, update, remove. */
  const apiBase =
    (typeof import.meta !== 'undefined' &&
      import.meta &&
      import.meta.env &&
      (import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL)) ||
    null;

  const hasLocalStorage = (() => {
    try {
      if (typeof localStorage === 'undefined') return false;
      const k = '__notes_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  })();

  const LS_KEY = 'ocean-notes-v1';
  let memory = [];

  function readLocal() {
    if (!hasLocalStorage) return memory;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  function writeLocal(data) {
    if (!hasLocalStorage) {
      memory = data;
      return;
    }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      // if quota or other error, keep only in memory
      memory = data;
    }
  }

  async function list() {
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/notes`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch notes');
        return await res.json();
      } catch (e) {
        console.warn('API unavailable, falling back to local storage.', e);
      }
    }
    return readLocal();
  }

  async function get(id) {
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/notes/${encodeURIComponent(id)}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch note');
        return await res.json();
      } catch (e) {
        console.warn('API unavailable for get, fallback.', e);
      }
    }
    return readLocal().find((n) => n.id === id) || null;
  }

  async function create(note) {
    const toSave = {
      id: note.id || cryptoRandomId(),
      title: note.title || 'Untitled',
      body: note.body || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(toSave),
        });
        if (!res.ok) throw new Error('Failed to create note');
        return await res.json();
      } catch (e) {
        console.warn('API unavailable for create, saving locally.', e);
      }
    }
    const data = readLocal();
    data.unshift(toSave);
    writeLocal(data);
    return toSave;
  }

  async function update(id, patch) {
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/notes/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...patch, updatedAt: Date.now() }),
        });
        if (!res.ok) throw new Error('Failed to update note');
        return await res.json();
      } catch (e) {
        console.warn('API unavailable for update, saving locally.', e);
      }
    }
    const data = readLocal();
    const idx = data.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...patch, updatedAt: Date.now() };
    writeLocal(data);
    return data[idx];
  }

  async function remove(id) {
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/notes/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to delete note');
        return true;
      } catch (e) {
        console.warn('API unavailable for delete, removing locally.', e);
      }
    }
    const data = readLocal().filter((n) => n.id !== id);
    writeLocal(data);
    return true;
  }

  return { list, get, create, update, remove };
}

// PUBLIC_INTERFACE
export function cryptoRandomId() {
  /** Generate a short random id using crypto if available. */
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    return (
      arr[0].toString(36).slice(0, 6) +
      arr[1].toString(36).slice(0, 6)
    );
  }
  return Math.random().toString(36).slice(2, 10);
}
