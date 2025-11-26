import Blits from '@lightningjs/blits'
import { Theme } from './theme'
import { createStorage } from './services/storage'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'

export default Blits.Application({
  template: `
    <Element w="1920" h="1080">
      <!-- Always-on background to guarantee visible pixels -->
      <Element ref="Bg" w="1920" h="1080"></Element>

      <!-- Simple top header strip for immediate visibility -->
      <Element ref="TopBar" w="1920" h="56" :style="{ rect: true, color: 0xffffffff }">
        <Text x="24" y="14" text="Ocean Notes" fontSize="28" :textColor="Theme.colors.text"></Text>
      </Element>

      <!-- Main layout -->
      <Element ref="Sidebar" x="24" y="80" w="360" h="976"></Element>
      <Element ref="Editor" x="408" y="80" w="1488" h="976"></Element>

      <!-- Toast -->
      <Element ref="Toast" alpha="0" x="24" y="1008" w="420" h="44">
        <Element mount="0.5" x="210" y="22">
          <Text ref="ToastLabel" fontSize="18" textColor="0xffffffff" text=""></Text>
        </Element>
      </Element>

      <!-- Lightweight in-app loading banner -->
      <Element ref="LoadingBanner" alpha="1" mount="0.5" x="960" y="540" w="220" h="40"
        :style="{ rect: true, color: Theme.colors.text, shader: { type: 'RoundedRectangle', radius: 10 } }">
        <Text mount="0.5" x="110" y="20" text="Booting…" fontSize="18" textColor="0xffffffff" />
      </Element>
    </Element>
  `,
  data() {
    return {
      Theme,
      _store: null,
      _selected: null,
      _toastTimer: null,
    }
  },
  async onCreate() {
    try {
      // Background gradient
      this.$refs.Bg.style = {
        rect: true,
        colorTop: 0x08ffffff,
        colorBottom: 0x08dbeafe,
      }
      // Toast style
      this.$refs.Toast.style = {
        rect: true,
        color: Theme.colors.text,
        shader: { type: 'RoundedRectangle', radius: 10 },
      }

      // Init storage
      this._store = createStorage()

      // Attach components
      this.$patch({
        Sidebar: {
          __isComponent__: true,
          component: NoteList,
          props: {
            dataProvider: this._store,
            onSelect: (note) => this.selectNote(note),
            onCreate: () => this.createNote(),
            onDelete: (note) => this.deleteNote(note),
          },
        },
        Editor: {
          __isComponent__: true,
          component: NoteEditor,
          props: {
            dataProvider: this._store,
            onDelete: (note) => this.deleteNote(note),
          },
        },
      })

      await this.$refs.Sidebar.instance.refresh(this._selected?.id)
      const items = await this._store.list()
      if (items.length) {
        this.selectNote(items[0])
      } else {
        this.$refs.Editor.instance.note = null
      }
    } catch (e) {
      // Make the error visible in UI and console to avoid silent blank screen
      console.error('[Ocean Notes] onCreate failed:', e)
      this.$showToast('Startup error. Check console.')
    } finally {
      // Hide loading banner and notify DOM to remove fallbacks
      if (this.$refs.LoadingBanner) this.$refs.LoadingBanner.alpha = 0
      window.dispatchEvent(new Event('ocean-notes:ready'))
    }
  },

  // PUBLIC_INTERFACE
  createNote: async function () {
    /** Create a new note and focus it in the editor. */
    const created = await this._store.create({ title: 'Untitled', body: '' })
    await this.$refs.Sidebar.instance.refresh(created.id)
    this.selectNote(created)
    this.$showToast('Note created')
  },

  // PUBLIC_INTERFACE
  deleteNote: async function (note) {
    /** Delete a note with basic error handling and update UI. */
    if (!note) return
    try {
      await this._store.remove(note.id)
      this.$showToast('Note deleted')
    } catch {
      this.$showToast('Error deleting note')
    }
    await this.$refs.Sidebar.instance.refresh()
    const items = await this._store.list()
    this.selectNote(items[0] || null)
  },

  // PUBLIC_INTERFACE
  selectNote: function (note) {
    /** Select a note to display in the editor. */
    this._selected = note
    this.$refs.Sidebar.instance.refresh(this._selected?.id)
    this.$refs.Editor.instance.note = note
  },

  // PUBLIC_INTERFACE
  $showToast: function (message) {
    /** Show a transient toast message in the UI. */
    const toast = this.$refs.Toast
    const label = this.$refs.ToastLabel
    label.text = message
    toast.alpha = 0.9
    if (this._toastTimer) clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(() => (toast.alpha = 0), 1600)
  },
})
