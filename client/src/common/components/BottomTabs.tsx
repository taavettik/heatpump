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
          <Tab icon={HomeIcon} link="/" label="Home" />

          <Tab icon={CalendarIcon} link="/schedules" label="Schedules" />
        </Stack>
      </InnerContainer>
    </TabContainer>
  );
}

interface TabProps {
  icon: IconType;
  label: string;
  iconSize?: number;
  link: string;
}

function Tab({ icon: Icon, link, label, iconSize = 32 }: TabProps) {
  const path = window.location.pathname;

  const active = path === link;

  const color = active ? 'muted1' : 'muted3';

  return (
    <TabLink href={link}>
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
