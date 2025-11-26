export const Theme = {
  colors: {
    background: 0xfff9fafb, // #f9fafb
    surface: 0xffffffff, // #ffffff
    text: 0xff111827, // #111827
    primary: 0xff2563eb, // #2563EB
    secondary: 0xfff59e0b, // #F59E0B
    error: 0xffef4444, // #EF4444
    muted: 0xff6b7280, // slate-500-ish
    border: 0xffe5e7eb, // #e5e7eb
    sidebarBg: 0xfff3f4f6, // #f3f4f6
    sidebarItemBgActive: 0xffdbeafe, // #dbeafe
  },
  radii: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    titleSize: 42,
    subtitleSize: 28,
    bodySize: 22,
    smallSize: 18,
  },
  shadows: {
    // lightning doesn't have CSS shadows; emulate with subtle gradient overlays if needed
    surfaceOverlay: 0x0f000000,
  },
  gradients: {
    // subtle gradient from blue to gray with low alpha
    oceanSoft: [
      { color: 0x1a3b82f6, offset: 0 }, // blue-500/10
      { color: 0x10f3f4f6, offset: 1 }, // gray-50-ish translucency
    ],
  },
};
