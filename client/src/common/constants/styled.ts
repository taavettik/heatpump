import { createStitches } from '@stitches/react';

const baseTheme = {
  colors: {
    primaryMain: '#1C77C3',
    primaryMuted1: '#196EB3',
    primaryMuted2: '#1763A1',
    //warmMain: '#FF4000',
    warmMain: '#FF934F',
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

export type Spacing = keyof typeof baseTheme['space'];

export const { styled, css, globalCss, theme } = createStitches({
  theme: baseTheme,
});
