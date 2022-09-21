import { useState } from 'preact/hooks';
import { styled } from '../constants/styled';
import { Stack } from './Layout';

/**
 * COMPLETELY unaccessible slider-component
 */
export function Slider() {
  /**
   * Value from 0 - 100 (%)
   */
  const [value, setValue] = useState(0);

  return (
    <SliderContainer>
      <SliderThumb
        style={{
          left: 0,
        }}
      />
    </SliderContainer>
  );
}

const SliderContainer = styled('div', {
  minWidth: 200,
  display: 'flex',
  position: 'relative',
});

const SliderThumb = styled('button', {
  position: 'absolute',
});
