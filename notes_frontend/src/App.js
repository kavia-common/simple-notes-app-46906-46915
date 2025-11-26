import Blits from '@lightningjs/blits'
import { Theme } from './theme'
import { createStorage } from './services/storage'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'

// Export a valid Blits Application with minimal, always-visible baseline UI
export default Blits.Application({
  template: `
    <Element w="1920" h="1080">
      <Element ref="Bg" w="1920" h="1080"></Element>

      <Text ref="BootLabel" mount="0.5" x="960" y="540" fontSize="32">Ocean Notes</Text>

      <Element ref="TopBar" w="1920" h="56">
        <Text ref="TopBarTitle" x="24" y="14" fontSize="28">Ocean Notes</Text>
      </Element>

      <Element ref="Sidebar" x="24" y="80" w="360" h="976"></Element>
      <Element ref="Editor" x="408" y="80" w="1488" h="976"></Element>

      <Element ref="Toast" alpha="0" x="24" y="1008" w="420" h="44">
        <Element mount="0.5" x="210" y="22">
          <Text ref="ToastLabel" fontSize="18"></Text>
        </Element>
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
    // Baseline painting with safe style usage
    try {
      this.$refs.Bg.style = {
        rect: true,
        colorTop: Theme.colors.background,
        colorBottom: 0xffeef2ff,
      }
      this.$refs.TopBar.style = { rect: true, color: Theme.colors.surface }
      this.$refs.TopBarTitle.textColor = Theme.colors.text
      this.$refs.BootLabel.textColor = Theme.colors.text
      this.$refs.Toast.style = {
        rect: true,
        color: Theme.colors.text,
        shader: { type: 'RoundedRectangle', radius: 10 },
      }
      this.$refs.ToastLabel.textColor = 0xffffffff
    } catch (e) {
      console.error('[Ocean Notes] Baseline styling failed:', e)
    }

    // Signal ready even if features fail, to remove overlays
    try {
      window.dispatchEvent(new Event('ocean-notes:ready'))
    } catch (e) {
      console.warn('[Ocean Notes] Dispatch ready event failed:', e)
    }

    // Progressive enablement: wrap storage + children to prevent blank screen
    try {
      this._store = createStorage()

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

      // Initial data load
      if (this.$refs.Sidebar?.instance?.refresh) {
        await this.$refs.Sidebar.instance.refresh(this._selected?.id)
      }
      const items = (await this._store.list()) || []
      if (items.length) {
        this.selectNote(items[0])
      } else if (this.$refs.Editor?.instance) {
        this.$refs.Editor.instance.note = null
      }
    } catch (e) {
      console.error('[Ocean Notes] Feature initialization failed:', e)
      this.$showToast('Limited mode: storage/features unavailable.')
    }
  },

  // PUBLIC_INTERFACE
  createNote: async function () {
    /** Create a new note and focus it in the editor. */
    if (!this._store) return this.$showToast('Storage unavailable')
    const created = await this._store.create({ title: 'Untitled', body: '' })
    if (this.$refs.Sidebar?.instance?.refresh) {
      await this.$refs.Sidebar.instance.refresh(created.id)
    }
    this.selectNote(created)
    this.$showToast('Note created')
  },

  // PUBLIC_INTERFACE
  deleteNote: async function (note) {
    /** Delete a note with basic error handling and update UI. */
    if (!this._store || !note) return
    try {
      await this._store.remove(note.id)
      this.$showToast('Note deleted')
    } catch {
      this.$showToast('Error deleting note')
    }
    if (this.$refs.Sidebar?.instance?.refresh) {
      await this.$refs.Sidebar.instance.refresh()
    }
    const items = await this._store.list()
    this.selectNote(items[0] || null)
  },

  // PUBLIC_INTERFACE
  selectNote: function (note) {
    /** Select a note to display in the editor. */
    this._selected = note
    if (this.$refs.Sidebar?.instance?.refresh) {
      this.$refs.Sidebar.instance.refresh(this._selected?.id)
    }
    if (this.$refs.Editor?.instance) {
      this.$refs.Editor.instance.note = note
    }
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
