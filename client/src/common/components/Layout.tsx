import { CSSProperties } from '@stitches/react';
import { ComponentChildren } from 'preact';
import { Spacing, styled } from '../constants/styled';

interface Props {
  axis?: 'x' | 'y';
  spacing?: Spacing;
  children?: ComponentChildren;

  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  width?: CSSProperties['width'];
}

export function Stack({ axis, spacing, children, ...styles }: Props) {
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
      }}
    >
      {children}
    </BaseStack>
  );
}

const BaseStack = styled('div', {
  display: 'flex',
});
