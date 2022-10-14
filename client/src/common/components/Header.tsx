import { styled } from '../constants/styled';
import { Text } from './Text';

export function Header() {
  return (
    <HeaderContainer>
      <InnerContainer>
        <Text variant="title3">Home</Text>
      </InnerContainer>
    </HeaderContainer>
  );
}

const HeaderContainer = styled('div', {
  display: 'flex',
  backgroundColor: '$primaryMuted2',
  width: '100%',
  boxShadow: '0 2px 2px $colors$primaryMuted3',
});

const InnerContainer = styled('div', {
  maxWidth: '600px',
  padding: '$xsmall $large',
});
