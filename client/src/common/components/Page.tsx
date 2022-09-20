import { ComponentChildren } from 'preact';
import { styled } from '../constants/styled';

interface Props {
  children?: ComponentChildren;
}

export function Page({ children }: Props) {
  return (
    <PageContainer>
      <PageWrapper>{children}</PageWrapper>
    </PageContainer>
  );
}

const PageContainer = styled('div', {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  display: 'flex',
  color: 'white',
  justifyContent: 'center',
});

const PageWrapper = styled('div', {
  width: '100%',
  padding: '$small',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
