import { createStitches } from '@stitches/react';

const baseTheme = {
  colors: {
    primaryMain: '#1C77C3',
    primaryMuted1: '#196EB3',
    primaryMuted2: '#1763A1',
    primaryMuted3: '#124D7D',
    //warmMain: '#FF4000',
    warmMain: '#FF934F',
    coolMain: '#56CBF9',

    success: '#4CB963',
    error: '#FB3640',

    text: 'white',
    muted1: '#eaeaea',
    muted2: '#D8D8D8',
    muted3: '#C2C2C2',
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

export type Color = keyof typeof baseTheme['colors'];

export const { styled, css, globalCss, theme } = createStitches({
  theme: baseTheme,
});
