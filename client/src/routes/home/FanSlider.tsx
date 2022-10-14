import { Spacing, Stack } from '../../common/components/Layout';
import { Slider } from '../../common/components/Slider';
import { FanIcon } from '../../common/constants/icons';

interface Props {
  initialValue: number;
  onChange: (speed: number) => void;
}

export function FanSlider({ initialValue, onChange }: Props) {
  return (
    <Stack align="center" axis="x">
      <FanIcon />

      <Spacing size="normal" axis="x" />

      <Slider
        value={initialValue === 4 ? 100 : initialValue * 20}
        onChange={(val) => {
          // speed on scale 0.. 4
          const speed = Math.min(Math.floor(val / 20), 4);

          onChange(speed);
        }}
      />

      <Spacing size="small" axis="x" />

      <FanIcon size={32} />
    </Stack>
  );
}
