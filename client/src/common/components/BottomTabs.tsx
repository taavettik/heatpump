import { IconType } from 'react-icons';
import { CalendarIcon, HomeIcon } from '../constants/icons';
import { styled } from '../constants/styled';
import { Spacing, Stack } from './Layout';
import { Text } from './Text';

export function BottomTabs() {
  return (
    <TabContainer>
      <InnerContainer>
        <Stack axis="x" justify="center" spacing="normal">
          <Tab icon={HomeIcon} label="Home" />

          <Tab icon={CalendarIcon} label="Schedules" active />
        </Stack>
      </InnerContainer>
    </TabContainer>
  );
}

interface TabProps {
  icon: IconType;
  label: string;
  active?: boolean;
  iconSize?: number;
}

function Tab({ icon: Icon, label, active, iconSize = 32 }: TabProps) {
  const color = active ? 'muted2' : 'text';

  return (
    <TabLink href="/">
      <Icon color={`var(--colors-${color})`} size={iconSize} />

      <Spacing axis="y" size="xxxsmall" />

      <Text color={color} variant="body">
        {label}
      </Text>
    </TabLink>
  );
}

const TabLink = styled('a', {
  display: 'flex',
  color: 'white',
  textDecoration: 'none',
  cursor: 'pointer',
  flexDirection: 'column',
  alignItems: 'center',
  width: 72,
});

const TabContainer = styled('div', {
  display: 'flex',
  backgroundColor: '$primaryMuted2',
  width: '100%',
  boxShadow: '0 -1px 2px $colors$primaryMuted3',
});

const InnerContainer = styled('div', {
  padding: '$small',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: '100%',
});
