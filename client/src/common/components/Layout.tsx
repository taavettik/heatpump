import { CSSProperties } from '@stitches/react';
import { ComponentChildren } from 'preact';
import { Spacing as TSpacing, styled } from '../constants/styled';

interface StackProps {
  axis?: 'x' | 'y';
  spacing?: TSpacing;
  children?: ComponentChildren;

  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  width?: CSSProperties['width'];
  style?: CSSProperties;
}

export function Stack({
  axis,
  spacing,
  children,
  style: styleProp,
  ...styles
}: StackProps) {
  const style: CSSProperties = {
    flexDirection: axis === 'x' ? 'row' : 'column',
    alignItems: styles.align,
    justifyContent: styles.justify,
    width: styles.width,
  };

  const marginKey = axis === 'x' ? 'marginLeft' : 'marginTop';

  return (
    <BaseStack
      css={{
        ...style,
        '& > *:first-child': {
          [marginKey]: '0 !important',
        },
        '& > *': {
          [marginKey]: spacing ? `$${spacing}` : '0',
        },
        ...styleProp,
      }}
    >
      {children}
    </BaseStack>
  );
}

interface SpacingProps {
  size?: TSpacing;
  axis?: 'x' | 'y';
}

export function Spacing({ size = 'small', axis = 'y' }: SpacingProps) {
  return (
    <BaseStack
      css={{
        [axis === 'y' ? 'margin-top' : 'margin-left']: `$${size}`,
      }}
    ></BaseStack>
  );
}

const BaseStack = styled('div', {
  display: 'flex',
});
