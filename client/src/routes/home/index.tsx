import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'preact/hooks';
import { api } from '../../common/api';
import { Spacing, Stack } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { Slider } from '../../common/components/Slider';
import { Text } from '../../common/components/Text';
import { Toggle } from '../../common/components/Toggle';
import { styled } from '../../common/constants/styled';
import { useUpdateHeatpumpStateMutation } from '../../hooks/mutations';
import { useHeatpumpQuery } from '../../hooks/queries';
import { Heatpump, Schedule } from '../../shared/schema';
import { CamelCase } from '../../shared/types';
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

function isScheduleActive(
  schedule: CamelCase<Schedule>,
  temperature: number,
  fanSpeed: number,
) {
  return fanSpeed === schedule.fanSpeed && temperature === schedule.temperature;
}

export function HomePage(props: Props) {
  const { data } = useHeatpumpQuery();
  const updateState = useUpdateHeatpumpStateMutation();

  const [temp, setTemp] = useState(data?.temperature ?? 20);
  const [fanSpeed, setFanSpeed] = useState(data?.fanSpeed ?? 0);
  const [on, setOn] = useState(data?.power ?? true);

  useEffect(() => {
    if (!data) {
      return;
    }
    setTemp(data.temperature);
    setFanSpeed(data.fanSpeed);
    setOn(data.power);
  }, [data]);

  if (!data) {
    return null;
  }

  const scheduled =
    data.schedule && isScheduleActive(data.schedule, temp, fanSpeed);

  return (
    <Page>
      <Spacing size="xlarge" />

      <Text variant="title1">Good day!</Text>

      <Spacing size="normal" />

      <WheelInput
        color={on ? (scheduled ? 'coolMain' : 'warmMain') : 'error'}
        startAngle={tempToAngle(data.temperature)}
        onChange={(angle) => setTemp(Math.round(angleToTemp(angle)))}
        header={
          on ? (
            <Stack axis="y" align="center">
              <Text style={{ fontWeight: 'normal' }} variant="title1">
                {temp}°C
              </Text>

              <Text
                style={{ fontWeight: 'normal', whiteSpace: 'pre' }}
                variant="title2"
              >
                {scheduled ? '(scheduled)' : ' '}
              </Text>
            </Stack>
          ) : (
            'OFF'
          )
        }
        onBlur={() =>
          updateState.mutate({
            temperature: temp,
          })
        }
      />

      <FanSlider
        initialValue={Math.min(data.fanSpeed, 4)}
        onChange={(speed) => {
          setFanSpeed(speed);
          updateState.mutate({
            fanSpeed: speed,
          });
        }}
      />

      <Spacing size="normal" />

      <Stack axis="x" align="center" spacing="small">
        <Toggle
          state={on}
          onChange={(target) => {
            setOn(target);
            updateState.mutate({
              power: target,
            });
          }}
        />

        <Stack width="130px">
          <Text variant="title3">{on ? 'Power ON' : 'Power OFF'}</Text>
        </Stack>
      </Stack>
    </Page>
  );
}
