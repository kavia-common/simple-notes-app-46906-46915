import Blits from '@lightningjs/blits'

/**
 * Simple Button sample component corrected for Blits template syntax.
 * - No Vue-style :content binding.
 * - Use explicit open/close Text tag and set text via refs.
 */
export default Blits.Component('Button', {
  template: `
    <Element ref="Root" w="200" h="48">
      <Element ref="Bg" w="200" h="48"></Element>
      <Text ref="Label" x="12" y="12" fontSize="20"></Text>
    </Element>
  `,
  data() {
    return {
      isFavorited: false,
      favoriteText: 'Press Enter',
      unfavoriteText: 'Press Enter Again',
    }
  },
  onCreate() {
    // Basic background style via style object (no bare rect/color)
    this.$refs.Bg.style = {
      rect: true,
      color: 0xff2563eb,
      shader: { type: 'RoundedRectangle', radius: 10 },
    }
    this._renderLabel()
  },
  methods: {
    _renderLabel() {
      const txt = this.isFavorited ? this.unfavoriteText : this.favoriteText
      this.$refs.Label.text = txt
      this.$refs.Label.textColor = 0xffffffff
    },
  },
  input: {
    enter() {
      this.isFavorited = !this.isFavorited
      this._renderLabel()
    },
  },
})
