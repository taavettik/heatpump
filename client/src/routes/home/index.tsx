import { useState } from 'preact/hooks';
import { Spacing, Stack } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { Text } from '../../common/components/Text';
import { WheelInput } from './WheelInput';

interface Props {
  path?: string;
}

function tempToAngle(temp: number) {
  return ((temp - 10) / 20) * 270;
}

function angleToTemp(angle: number) {
  return (angle / 270) * 20 + 10;
}

export function HomePage(props: Props) {
  const [temp, setTemp] = useState(20);

  return (
    <Page>
      <Spacing size="xlarge" />

      <Text variant="title1">Good day!</Text>

      <Spacing size="normal" />

      <WheelInput
        startAngle={tempToAngle(temp)}
        onChange={(angle) => setTemp(Math.round(angleToTemp(angle)))}
        header={`${temp} °C`}
      />
    </Page>
  );
}
