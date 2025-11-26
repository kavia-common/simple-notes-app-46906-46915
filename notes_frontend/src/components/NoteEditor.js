import Blits from '@lightningjs/blits'
import { Theme } from '../theme'

export default Blits.Component('NoteEditor', {
  props: ['dataProvider', 'onDelete'],
  template: `
    <Element ref="Root">
      <Element ref="Pad" x="24" y="24">
        <Element ref="TitleBg" h="56">
          <Text ref="Title" x="16" y="12" text="Untitled" fontSize="26"></Text>
        </Element>
        <Element ref="BodyBg" y="72">
          <Text ref="Body" x="16" y="16" fontSize="22"></Text>
        </Element>
        <Element ref="Footer" h="60">
          <Text ref="Hint" x="4" y="16" text="Changes autosave" fontSize="16"></Text>
          <Element ref="DeleteBtn" y="8" w="120" h="44">
            <Text mount="0.5" x="60" y="22" text="Delete" fontSize="20" textColor="0xffffffff"></Text>
          </Element>
        </Element>
      </Element>
      <Text ref="EmptyState" mount="0.5" alpha="0.7" text="Select a note or create a new one" fontSize="24"></Text>
    </Element>
  `,
  data() {
    return {
      Theme,
      _note: null,
      _focusField: 'title',
    }
  },
  onCreate() {
    // Size and styles
    this.$refs.Root.w = this.w
    this.$refs.Root.h = this.h
    this.$refs.Root.style = { rect: true, color: Theme.colors.surface, shader: { type: 'RoundedRectangle', radius: Theme.radii.xl } }

    const padW = this.w - 48
    const padH = this.h - 48
    this.$refs.Pad.w = padW
    this.$refs.Pad.h = padH

    this.$refs.TitleBg.w = padW
    this.$refs.TitleBg.style = { rect: true, color: 0xffeef2ff, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } }
    this.$refs.Title.textColor = Theme.colors.text

    this.$refs.BodyBg.w = padW
    this.$refs.BodyBg.h = padH - 136
    this.$refs.BodyBg.style = { rect: true, color: 0xffffffff, shader: { type: 'RoundedRectangle', radius: Theme.radii.lg } }
    this.$refs.Body.textColor = Theme.colors.text
    this.$refs.Body.wordWrap = true
    this.$refs.Body.wordWrapWidth = this.w - 96

    this.$refs.Footer.y = this.h - 100
    this.$refs.Footer.w = padW
    this.$refs.Hint.textColor = Theme.colors.muted

    this.$refs.DeleteBtn.x = this.w - 140
    this.$refs.DeleteBtn.style = { rect: true, color: Theme.colors.error, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } }

    this.$refs.EmptyState.x = this.w / 2
    this.$refs.EmptyState.y = this.h / 2
    this.$refs.EmptyState.textColor = Theme.colors.muted

    this.$refs.DeleteBtn.on('click', () => {
      if (!this._note) return
      this.onDelete && this.onDelete(this._note)
    })
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
