import { Spacing, Stack } from '../../common/components/Layout';
import { Slider } from '../../common/components/Slider';
import { FanIcon } from '../../common/constants/icons';

export function FanSlider() {
  return (
    <Stack align="center" axis="x">
      <FanIcon />

      <Spacing size="normal" axis="x" />

      <Slider />

      <Spacing size="small" axis="x" />

      <FanIcon size={32} />
    </Stack>
  );
}
