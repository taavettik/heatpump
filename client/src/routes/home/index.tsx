import { useQuery } from '@tanstack/react-query';
import { useState } from 'preact/hooks';
import { fetchHeatpump } from '../../common/api';
import { Spacing, Stack } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { Slider } from '../../common/components/Slider';
import { Text } from '../../common/components/Text';
import { FanSlider } from './FanSlider';
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
  const { data } = useQuery(['heatpump'], fetchHeatpump);

  console.log(data);

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

      <FanSlider />
    </Page>
  );
}
