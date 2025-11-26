import Blits from '@lightningjs/blits'
import { Theme } from '../theme'

export default Blits.Component('Header', {
  template: `
    <Element ref="Root" h="64">
      <Element ref="Border" y="63" h="1"></Element>
      <Text ref="Title" x="24" y="16" text="Ocean Notes" fontSize="28"></Text>
      <Element ref="Actions" y="12" mountX="1"></Element>
    </Element>
  `,
  data() {
    return {
      Theme,
      _actions: [],
    }
  },
  onCreate() {
    // Size follows parent
    this.$refs.Root.w = this.w
    this.$refs.Border.w = this.w
    this.$refs.Actions.x = this.w - 24

    // Styles
    this.$refs.Root.style = { rect: true, color: Theme.colors.surface }
    this.$refs.Border.style = { rect: true, color: Theme.colors.border }
    this.$refs.Title.textColor = Theme.colors.text
  },
  // PUBLIC_INTERFACE
  addAction(label, onClick, variant = 'primary') {
    /** Add a header action button. */
    const idx = this._actions.length
    const bg = variant === 'secondary' ? Theme.colors.secondary : Theme.colors.primary
    const ref = `Action${idx}`
    this._actions.push({ label, onClick, bg })
    this.$patch({
      Actions: {
        [ref]: {
          w: 120,
          h: 40,
          style: { rect: true, color: bg, shader: { type: 'RoundedRectangle', radius: Theme.radii.md } },
          x: -idx * 132,
          children: [
            {
              mount: 0.5,
              x: 60,
              y: 20,
              text: { text: label, fontSize: 20, textColor: 0xffffffff },
            },
          ],
          on: {
            click: () => onClick && onClick(),
          },
        },
      },
    })
  },
})
