import Blits from '@lightningjs/blits'

export default Blits.Component('Loader', {
  template: `
    <Element ref="Root" w="200" h="40">
      <Element ref="Dot1" w="40" h="40"></Element>
      <Element ref="Dot2" x="60" w="40" h="40"></Element>
      <Element ref="Dot3" x="120" w="40" h="40"></Element>
    </Element>
    `,
  // PUBLIC_INTERFACE
  /** Props: loaderColor */
  props: ['loaderColor'],
  data() {
    return {
      alpha: 0,
    }
  },
  onCreate() {
    const color = this.loaderColor ? this._parseColor(this.loaderColor) : 0xff94a3b8
    ;['Dot1', 'Dot2', 'Dot3'].forEach((ref) => {
      this.$refs[ref].style = { rect: true, color, shader: { type: 'RoundedRectangle', radius: 20 } }
      this.$refs[ref].alpha = 0.4
    })
    this.start()
  },
  methods: {
    _parseColor(input) {
      if (typeof input === 'number') return input
      // Accept hex '#RRGGBB' -> 0xffRRGGBB
      if (typeof input === 'string' && input.startsWith('#') && input.length === 7) {
        return Number('0xff' + input.slice(1))
      }
      return 0xff94a3b8
    },
    /** Start pulsing animation */
    start() {
      let up = true
      this.$setInterval(() => {
        this.alpha = up ? 1 : 0.4
        ;['Dot1', 'Dot2', 'Dot3'].forEach((ref, i) => {
          const base = 0.3 + i * 0.2
          this.$refs[ref].alpha = Math.max(0.2, Math.min(1, this.alpha * base + (up ? 0.2 : -0.2)))
        })
        up = !up
      }, 600)
    },
  },
})
