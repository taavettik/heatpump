import { createStitches } from '@stitches/react';

const theme = {
  colors: {
    primaryMain: '#1C77C3',
    primaryMuted1: '#196EB3',
    primaryMuted2: '#1763A1',
  },
  space: {
    xxxsmall: '4px',
    xxsmall: '8px',
    xsmall: '12px',
    small: '16px',
    normal: '24px',
    large: '32px',
    xlarge: '48px',
    xxlarge: '64px',
    xxxlarge: '128px',
  },
};

export type Spacing = keyof typeof theme['space'];

export const { styled, css, globalCss } = createStitches({
  theme,
});
