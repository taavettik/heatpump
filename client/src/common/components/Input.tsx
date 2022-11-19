import { styled } from '../constants/styled';

export const Input = styled('input', {
  backgroundColor: '$background',
  color: '$textSecondary',
  fontSize: 24,
  border: 'none',
  borderRadius: 4,

  outline: 'none !important',
  padding: 4,

  '&:focus': {
    boxShadow: '0 0 1px 1px black',
  },
});
