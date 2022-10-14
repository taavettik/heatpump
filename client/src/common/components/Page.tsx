import { ComponentChildren } from 'preact';
import { styled } from '../constants/styled';
import { BottomTabs } from './BottomTabs';
import { Header } from './Header';

interface Props {
  children?: ComponentChildren;
}

export function Page({ children }: Props) {
  return (
    <PageContainer>
      <Header></Header>

      <PageWrapper>{children}</PageWrapper>

      <BottomTabs />
    </PageContainer>
  );
}

const PageContainer = styled('div', {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  display: 'flex',
  color: 'white',
  //justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
});

const PageWrapper = styled('div', {
  padding: '$small',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
});
