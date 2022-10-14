import { ComponentChildren, h, JSX } from 'preact';
import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'preact/compat';
import { Color } from '../constants/styled';

type Typography = {
  element: keyof JSX.IntrinsicElements;
} & CSSProperties;

type TypographyVariant = 'body' | 'title1' | 'title2' | 'title3';

const typographies: Record<TypographyVariant, Typography> = {
  body: {
    element: 'span',
    fontSize: '16px',
  },
  title1: {
    element: 'h1',
    fontSize: '36px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title2: {
    element: 'h2',
    fontSize: '30px',
    fontWeight: '600',
  },
  title3: {
    element: 'h3',
    fontSize: '24px',
    fontWeight: 'normal',
  },
};

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TypographyVariant;
  children?: ComponentChildren;
  color?: Color;
}

export function Text({
  variant = 'body',
  color = 'text',
  ...props
}: TextProps) {
  const styles = typographies[variant];

  const { element, ...style } = styles;

  return h(element, {
    style: {
      ...style,
      color: `var(--colors-${color})`,
    },
    ...props,
  });
}
