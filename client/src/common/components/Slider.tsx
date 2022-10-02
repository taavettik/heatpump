import { useEffect, useRef, useState } from 'preact/hooks';
import { DraggableCore } from 'react-draggable';
import { styled } from '../constants/styled';
import { Stack } from './Layout';

interface Props {
  value?: number;
  onChange?: (val: number) => void;
}

/**
 * COMPLETELY unaccessible slider-component
 *
 * i'll implement keyboard navigation some day..
 */
export function Slider({ value: initialValue = 0, onChange }: Props) {
  /**
   * Value from 0 - 100 (%)
   */
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const containerRef = useRef<HTMLDivElement>();

  return (
    <SliderContainer ref={containerRef}>
      <DraggableCore
        onDrag={(d) => {
          if (!containerRef.current) {
            return;
          }

          const parentRect = containerRef.current.getBoundingClientRect();

          const clientX = 'touches' in d ? d.touches[0]?.clientX : d.clientX;

          if (clientX === undefined) {
            return;
          }

          const x: number = clientX - parentRect.x;

          const percentage = Math.max(Math.min(1, x / parentRect.width), 0);

          setValue(percentage * 100);
          console.log(Math.floor(percentage * 100));
        }}
        onStop={() => onChange?.(value)}
      >
        <SliderThumb
          style={{
            left: `${value.toFixed(2)}%`,
          }}
        />
      </DraggableCore>

      <SliderBar></SliderBar>
    </SliderContainer>
  );
}

const SliderContainer = styled('div', {
  minWidth: 200,
  height: 25,
  display: 'flex',
  position: 'relative',
});

const SliderThumb = styled('button', {
  position: 'absolute',
  height: 25,
  width: 25,
  borderRadius: 13,
  cursor: 'pointer',
  transform: 'translateX(-12.5px)',
  zIndex: 1,
  boxShadow: 'none',
  outline: 'none !important',
  border: 'none',
  backgroundColor: 'white',
});

const SliderBar = styled('div', {
  width: '100%',
  position: 'absolute',
  backgroundColor: '$primaryMuted3',
  borderRadius: 2,
  height: 10,
  top: 7.5,
});
