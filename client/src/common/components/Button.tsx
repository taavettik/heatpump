import { ComponentChildren, ComponentProps } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { IconType } from 'react-icons';
import { styled } from '../constants/styled';
import { Spacing } from './Layout';

type Props = ComponentProps<typeof BaseButton> & {
  children?: ComponentChildren;
  icon?: IconType;
};

export function Button({ children, icon: Icon, ...props }: Props) {
  return (
    <BaseButton {...props}>
      {Icon ? (
        <>
          <Icon /> <Spacing axis="x" size="small" />
        </>
      ) : null}
      {children}
    </BaseButton>
  );
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
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',

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

  variants: {
    color: {
      error: {
        border: '3px solid $errorMuted1',
        color: '$errorMuted1',
        '&:hover': {
          backgroundColor: '$errorHighlighted',
        },
      },
    },
  },
});
