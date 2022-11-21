import { ComponentChildren } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { styled } from '../constants/styled';

type Props = HTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export function Button({ children, ...props }: Props) {
  return <BaseButton {...props}>{children}</BaseButton>;
}

const BaseButton = styled('button', {
  backgroundColor: '$background',
  color: '$textSecondary',
  fontSize: 20,
  border: 'none',
  borderRadius: 4,
  outline: 'none !important',
  padding: '$xxsmall',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$muted1',
  },
  '&:disabled': {
    backgroundColor: '$background',
    cursor: 'initial',
    opacity: 0.8,
  },

  '&:focus': {
    boxShadow: '0 0 1px 1px black',
  },
});
