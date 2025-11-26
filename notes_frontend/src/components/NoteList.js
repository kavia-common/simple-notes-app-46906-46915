import Blits from '@lightningjs/blits'
import { Theme } from '../theme'

const NoteListItem = Blits.Component('NoteListItem', {
  props: ['note', 'active', 'onSelect', 'onDelete'],
  template: `
    <Element w="344" h="64">
      <Element ref="Bg" alpha="0" w="344" h="64"></Element>
      <Element x="12" y="10" w="320" h="44">
        <Text ref="Title" fontSize="20"></Text>
        <Text ref="Subtitle" y="26" fontSize="16"></Text>
      </Element>
      <Element ref="Delete" x="300" y="18" w="28" h="28" alpha="0">
        <Text mount="0.5" x="14" y="14" text="×" fontSize="22" textColor="0xffffffff"></Text>
      </Element>
    </Element>
  `,
  data() {
    return { Theme }
  },
  onCreate() {
    // Styles
    this.$refs.Bg.style = { rect: true, color: Theme.colors.sidebarItemBgActive, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } }
    this.$refs.Title.textColor = Theme.colors.text
    this.$refs.Subtitle.textColor = Theme.colors.muted
    this.$refs.Delete.style = { rect: true, color: Theme.colors.error, shader: { type: 'RoundedRectangle', radius: Theme.radii.sm } }

    this._renderNote()
    this.$on('focus', () => {
      this.$refs.Delete.alpha = 0.85
      this.scale = 1.01
    })
    this.$on('unfocus', () => {
      this.$refs.Delete.alpha = 0
      this.scale = 1
    })
    this.$on('enter', () => this.onSelect && this.onSelect(this.note))
    this.$on('right', () => this.onSelect && this.onSelect(this.note))
    this.$on('space', () => this.onSelect && this.onSelect(this.note))
    this.$refs.Delete.on('click', () => this.onDelete && this.onDelete(this.note))
  },
  watch: {
    note() { this._renderNote() },
    active(v) { this.$refs.Bg.alpha = v ? 1 : 0 },
  },
  methods: {
    _renderNote() {
      if (!this.note) return
      this.$refs.Title.text = this.note.title || 'Untitled'
      const date = new Date(this.note.updatedAt || this.note.createdAt || Date.now())
      this.$refs.Subtitle.text = `Updated ${date.toLocaleString()}`
    },
  },
})

export default Blits.Component('NoteList', {
  props: ['dataProvider', 'onSelect', 'onCreate', 'onDelete'],
  template: `
    <Element ref="Root">
      <Text ref="Title" x="16" y="16" text="Notes" fontSize="24"></Text>
      <Text ref="Empty" x="16" y="64" alpha="0" text="No notes yet. Create one →" fontSize="18"></Text>
      <Element ref="List" x="8" y="56" w="344"></Element>
      <Element ref="CreateBtn" x="16" w="328" h="44">
        <Text ref="CreateBtnLabel" mount="0.5" text="New Note" fontSize="20" textColor="0xffffffff"></Text>
      </Element>
    </Element>
  `,
  data() {
    return {
      Theme,
      _items: [],
    }
  },
  onCreate() {
    // Size and styles
    this.$refs.Root.w = this.w
    this.$refs.Root.h = this.h
    this.$refs.Root.style = { rect: true, color: Theme.colors.sidebarBg, shader: { type: 'RoundedRectangle', radius: Theme.radii.xl } }

    this.$refs.Title.textColor = Theme.colors.text
    this.$refs.Empty.textColor = Theme.colors.muted

    this.$refs.CreateBtn.y = this.h - 64
    this.$refs.CreateBtn.style = { rect: true, color: Theme.colors.primary, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } }
    this.$refs.CreateBtnLabel.x = this.$refs.CreateBtn.w / 2
    this.$refs.CreateBtnLabel.y = this.$refs.CreateBtn.h / 2

    this.$refs.CreateBtn.on('click', () => this.onCreate && this.onCreate())
  },
  async refresh(selectedId) {
    const items = await this.dataProvider.list()
    this._items = items
    this.$refs.List.children = items.map((n) => ({
      __isComponent__: true,
      component: NoteListItem,
      props: {
        note: n,
        active: n.id === selectedId,
        onSelect: () => this.onSelect && this.onSelect(n),
        onDelete: () => this.onDelete && this.onDelete(n),
      },
    }))
    this.$refs.Empty.alpha = items.length ? 0 : 1
  },
  onFocus() {
    if (!this.$refs.List.children?.length) this.$stage.focus = this.$refs.CreateBtn
  },
  onUp() {
    this._moveFocus(-1)
  },
  onDown() {
    this._moveFocus(1)
  },
  methods: {
    _moveFocus(dir) {
      const list = this.$refs.List
      const children = list.children || []
      if (!children.length) return
      const idx = children.indexOf(this.$app.focused)
      let next = idx + dir
      next = Math.max(0, Math.min(children.length - 1, next))
      this.$stage.focus = children[next]
    },
  },
})
