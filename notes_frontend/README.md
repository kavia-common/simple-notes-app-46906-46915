# Ocean Notes (LightningJS Blits)

A simple notes app built with LightningJS (Blits) featuring a modern Ocean Professional theme.

Features:
- Sidebar for note list
- Main editor to view/edit selected note
- Create, update, and delete notes
- Session persistence via localStorage (fallback to in-memory)
- Optional backend via env vars: VITE_API_BASE or VITE_BACKEND_URL

Run:
- npm install
- npm run dev

Keyboard:
- Up/Down to move in the list
- Enter/Space to select
- In editor: Up focuses title, Down focuses body
- Type to edit, Backspace to delete character, Enter adds newline in body
