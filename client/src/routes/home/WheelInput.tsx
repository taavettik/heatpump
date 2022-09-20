import { ComponentChildren } from 'preact';
import { useEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks';
import { default as Draggable, DraggableCore } from 'react-draggable';
import { Text } from '../../common/components/Text';
import { styled, theme } from '../../common/constants/styled';
import { deg2rad, rad2deg } from '../../common/utils/math';
import { generateArc } from '../../common/utils/svg';

function Background() {
  const d = useMemo(
    () => generateArc([120, 120], [100, 100], [deg2rad(135), deg2rad(270)], 0),
    [],
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="240"
      height="240"
      style={{
        top: 0,
        left: 0,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke="white"
        strokeWidth={15}
        stroke-dasharray="2, 20"
      ></path>
    </svg>
  );
}

function Marker({ angle = 0 }: { angle?: number }) {
  const d = useMemo(
    () =>
      generateArc([120, 120], [100, 100], [deg2rad(135), deg2rad(angle)], 0),
    [angle],
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="240"
      height="240"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={theme.colors.warmMain.value}
        strokeWidth={20}
      ></path>
    </svg>
  );
}

function getPosition(angle: number) {
  const r = 100;

  const startAngle = 225;

  return {
    x: Math.cos(deg2rad(startAngle - angle)) * r + 120 - 12.5,
    y: Math.sin(deg2rad(startAngle - angle)) * r + 120 - 12.5,
  };
}

interface Props {
  startAngle?: number;
  onChange?: (angle: number) => void;
  header?: string | ((angle: number) => string);
}

export function WheelInput({ startAngle, onChange, header }: Props) {
  const [angle, setAngle] = useState(startAngle || 0);
  const [tempAngle, setTempAngle] = useState(angle);

  const handlePos = getPosition(angle);
  const blobPos = getPosition(tempAngle);

  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={parentRef}>
      <DraggableCore
        onDrag={(d) => {
          if (!parentRef.current) {
            return;
          }

          const parentRect = parentRef.current.getBoundingClientRect();

          const clientX = 'touches' in d ? d.touches[0]?.clientX : d.clientX;
          const clientY = 'touches' in d ? d.touches[0]?.clientY : d.clientY;

          if (clientX === undefined || clientY === undefined) {
            return;
          }

          const x: number = clientX - parentRect.x;
          const y: number = clientY - parentRect.y;

          // diffs and distance from the center of the sphere
          const diffX = x - 120;
          const diffY = 120 - y;
          const dist = Math.sqrt(diffX ** 2 + diffY ** 2);

          const baseAngle = Math.asin(diffY / dist);
          const angle = diffX < 0 ? baseAngle : deg2rad(180) - baseAngle;

          const angleDeg = rad2deg(angle) + 45;

          const newAngle = Math.min(Math.max(angleDeg, 0), 270);

          onChange?.(newAngle);

          setTempAngle(newAngle);
        }}
        onStop={() => setAngle(tempAngle)}
      >
        <DragHandle
          /* this got real annoying */
          onContextMenu={(e: MouseEvent) => e.preventDefault()}
          style={{ left: handlePos.x, bottom: handlePos.y }}
        />
      </DraggableCore>
      <Blob style={{ left: blobPos.x, bottom: blobPos.y }} />
      <Marker angle={tempAngle} />
      <Background />

      <InnerContainer>
        <Text style={{ fontWeight: 'normal' }} variant="title1">
          {typeof header === 'function' ? header(tempAngle) : header}
        </Text>
      </InnerContainer>
    </Container>
  );
}

const Blob = styled('div', {
  position: 'absolute',
  backgroundColor: 'white',
  borderRadius: 13,
  width: 25,
  height: 25,
  zIndex: 1,
});

const DragHandle = styled('div', {
  position: 'absolute',
  width: 25,
  height: 25,
  zIndex: 2,
  cursor: 'pointer',
});

const InnerContainer = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const Container = styled('div', {
  position: 'relative',
  height: 240,
  width: 240,
});
