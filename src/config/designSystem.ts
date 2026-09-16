export const MINEINTEL_DESIGN_SYSTEM = {
  colors: {
    background: '#FFFFFF', // Clean White Presentation Slide
    text: '#201B14',       // Dark charcoal
    accent: '#8B2626',     // Restrained maroon (adjusted for prompt)
    surface: '#EAE4D9',    // Subtle warm neutrals
    border: '#D9D2C5'      // Soft dividing lines
  },
  typography: {
    display: { family: 'Space Grotesk', weight: 'bold', size: 72 },
    heading: { family: 'Space Grotesk', weight: 'bold', size: 48 },
    subheading: { family: 'Space Grotesk', weight: 'medium', size: 32 },
    body: { family: 'IBM Plex Mono', weight: 'normal', size: 24 },
    caption: { family: 'IBM Plex Mono', weight: 'normal', size: 16 },
    label: { family: 'IBM Plex Mono', weight: 'bold', size: 14 }
  },
  spacing: {
    base: 8,
    small: 16,
    medium: 32,
    large: 64,
    xlarge: 128
  },
  elements: {
    cardStyle: 'Flat, background matching surface color, no border unless interactive',
    borderStyle: 'Solid, 2px width, sharp corners or 4px radius',
    cornerRadius: 4,
    shadows: 'Minimal, 0px 4px 16px rgba(32, 27, 20, 0.08) - only for floating overlays',
    dividers: '1px solid border color',
    arrowStyle: 'Straight, 90-degree elbows, sharp triangular heads, technical',
    iconStyle: 'Monoline, 2px stroke, no fill, strictly minimal'
  },
  illustrationStyle: {
    default: [
      'technical', 
      'clean', 
      'professional', 
      'engineering',
      'editorial',
      'restrained',
      'consistent'
    ],
    avoid: [
      'generic corporate stock art',
      'random gradients',
      'cartoonish illustrations',
      'inconsistent 3D styles',
      'excessive decoration'
    ]
  }
};
