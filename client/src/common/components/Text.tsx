import { ComponentChildren, h, JSX } from 'preact';
import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'preact/compat';

type Typography = {
  element: keyof JSX.IntrinsicElements;
} & CSSProperties;

type TypographyVariant = 'body' | 'title1';

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
};

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TypographyVariant;
  children?: ComponentChildren;
}

export function Text({ variant = 'body', ...props }: TextProps) {
  const styles = typographies[variant];

  const { element, ...style } = styles;

  return h(element, { style, ...props });
}
