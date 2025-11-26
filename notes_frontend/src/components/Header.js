import Blits from '@lightningjs/blits'
import { Theme } from '../theme'

export default Blits.Component('Header', {
  template: `
    <Element :w="w" h="64" :style="{ rect: true, color: Theme.colors.surface }">
      <Element y="63" :w="w" h="1" :style="{ rect: true, color: Theme.colors.border }"></Element>
      <Text x="24" y="16" text="Ocean Notes" fontSize="28" :textColor="Theme.colors.text"></Text>
      <Element ref="Actions" :x="w - 24" y="12" mountX="1"></Element>
    </Element>
  `,
  data() {
    return {
      Theme,
      _actions: [],
    }
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
          // Use style object for rect/color/shader to comply with Blits parser
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
