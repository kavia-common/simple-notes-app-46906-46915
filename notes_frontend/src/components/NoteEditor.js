import Blits from '@lightningjs/blits'
import { Theme } from '../theme'

export default Blits.Component('NoteEditor', {
  props: ['dataProvider', 'onDelete'],
  template: `
    <Element :w="w" :h="h" :style="{ rect: true, color: Theme.colors.surface, shader: { type: 'RoundedRectangle', radius: Theme.radii.xl } }">
      <Element ref="Pad" x="24" y="24" :w="w - 48" :h="h - 48">
        <Element ref="TitleBg" :w="w - 48" h="56" :style="{ rect: true, color: 0xffeef2ff, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } }">
          <Text ref="Title" x="16" y="12" text="Untitled" fontSize="26" :textColor="Theme.colors.text"></Text>
        </Element>
        <Element ref="BodyBg" y="72" :w="w - 48" :h="h - 160" :style="{ rect: true, color: 0xffffffff, shader: { type: 'RoundedRectangle', radius: Theme.radii.lg } }">
          <Text ref="Body" x="16" y="16" fontSize="22" :textColor="Theme.colors.text" :wordWrap="true" :wordWrapWidth="w - 96"></Text>
        </Element>
        <Element ref="Footer" :y="h - 100" :w="w - 48" h="60">
          <Text x="4" y="16" text="Changes autosave" fontSize="16" :textColor="Theme.colors.muted"></Text>
          <Element ref="DeleteBtn" :x="w - 140" y="8" w="120" h="44" :style="{ rect: true, color: Theme.colors.error, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } }">
            <Text mount="0.5" x="60" y="22" text="Delete" fontSize="20" textColor="0xffffffff"></Text>
          </Element>
        </Element>
      </Element>
      <Text ref="EmptyState" mount="0.5" :x="w/2" :y="h/2" alpha="0.7" text="Select a note or create a new one" fontSize="24" :textColor="Theme.colors.muted"></Text>
    </Element>
  `,
  data() {
    return {
      Theme,
      _note: null,
      _focusField: 'title',
    }
  },
  watch: {
    note(n) {
      this._note = n
      if (!n) {
        this.$refs.EmptyState.alpha = 1
        this.$refs.Pad.alpha = 0
        return
      }
      this.$refs.EmptyState.alpha = 0
      this.$refs.Pad.alpha = 1
      this._setTitle(n.title || 'Untitled', false)
      this._setBody(n.body || '', false)
    },
  },
  methods: {
    async _save(patch) {
      try {
        const updated = await this.dataProvider.update(this._note.id, patch)
        if (updated) this._note = updated
      } catch {
        this.$app.$showToast && this.$app.$showToast('Save failed. Changes held locally.')
      }
    },
    _setTitle(v, save = true) {
      this.$refs.Title.text = v
      if (save && this._note) this._save({ title: v })
    },
    _setBody(v, save = true) {
      this.$refs.Body.text = v
      if (save && this._note) this._save({ body: v })
    },
  },
  onCreate() {
    this.$refs.DeleteBtn.on('click', () => {
      if (!this._note) return
      this.onDelete && this.onDelete(this._note)
    })
  },
  onUp() { this._focusField = 'title' },
  onDown() { this._focusField = 'body' },
  onBackspace() {
    if (!this._note) return
    if (this._focusField === 'title') {
      const t = this.$refs.Title.text || ''
      this._setTitle(t.slice(0, -1))
    } else {
      const b = this.$refs.Body.text || ''
      this._setBody(b.slice(0, -1))
    }
  },
  onEnter() {
    if (!this._note) return
    if (this._focusField === 'body') {
      const b = this.$refs.Body.text || ''
      this._setBody(b + '\n')
    }
  },
  onKey({ key }) {
    if (!this._note) return false
    if (key && key.length === 1) {
      if (this._focusField === 'title') {
        const t = this.$refs.Title.text || ''
        this._setTitle(t + key)
      } else {
        const b = this.$refs.Body.text || ''
        this._setBody(b + key)
      }
      return true
    }
    return false
  },
})
