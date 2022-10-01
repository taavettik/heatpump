import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'preact/hooks';
import { api } from '../../common/api';
import { Spacing, Stack } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { Slider } from '../../common/components/Slider';
import { Text } from '../../common/components/Text';
import { useUpdateHeatpumpStateMutation } from '../../hooks/mutations';
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
  const { data } = useQuery(['heatpump'], api.fetchHeatpump);
  const updateState = useUpdateHeatpumpStateMutation();

  const [temp, setTemp] = useState(data?.temperature ?? 20);
  const [fanSpeed, setFanSpeed] = useState(data?.fanSpeed ?? 20);

  useEffect(() => {
    if (!data) {
      return;
    }
    setTemp(data.temperature);
    setFanSpeed(data.fanSpeed);
  }, [data]);

  const syncState = () => {
    updateState.mutate({
      temperature: temp,
      fanSpeed: fanSpeed,
    });
  };

  useEffect(() => {
    syncState();
  }, [fanSpeed]);

  if (!data) {
    return null;
  }

  return (
    <Page>
      <Spacing size="xlarge" />

      <Text variant="title1">Good day!</Text>

      <Spacing size="normal" />

      <WheelInput
        startAngle={tempToAngle(temp)}
        onChange={(angle) => setTemp(Math.round(angleToTemp(angle)))}
        header={`${temp} °C`}
        onBlur={() => syncState()}
      />

      <FanSlider
        initialValue={data.fanSpeed}
        onChange={(speed) => setFanSpeed(speed)}
      />
    </Page>
  );
}
