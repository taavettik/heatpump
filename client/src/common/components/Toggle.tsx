import { styled } from '../constants/styled';

interface Props {
  state?: boolean;
  onChange?: (target: boolean) => void;
}

export function Toggle({ state = false, onChange }: Props) {
  return (
    <Container onClick={() => onChange?.(!state)} data-on={state}>
      <Blob data-on={state} />
    </Container>
  );
}

const Container = styled('button', {
  backgroundColor: '$error',
  height: '30px',
  width: '64px',
  borderRadius: '15px',
  display: 'flex',
  border: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '&[data-on]': {
    backgroundColor: '$success',
  },
});

const Blob = styled('div', {
  width: '24px',
  height: '24px',
  borderRadius: '12px',
  backgroundColor: 'white',
  boxShadow: '1px 1px 1px $colors$muted3',
  transform: 'translateX(-60%)',
  '&[data-on]': {
    transform: 'translateX(60%)',
  },
  transition: 'transform 0.1s ease-in-out',
});
