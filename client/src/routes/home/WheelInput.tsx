import { useEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks';
import { default as Draggable, DraggableCore } from 'react-draggable';
import { styled } from '../../common/constants/styled';
import { deg2rad, rad2deg } from '../../common/utils/math';
import { generateArc } from '../../common/utils/svg';

function Background() {
  const d = useMemo(
    () => generateArc([150, 150], [100, 100], [deg2rad(135), deg2rad(270)], 0),
    [],
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="300"
      height="300"
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
      generateArc([150, 150], [100, 100], [deg2rad(135), deg2rad(angle)], 0),
    [angle],
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="300"
      height="300"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <path d={d} fill="none" stroke="red" strokeWidth={20}></path>
    </svg>
  );
}

function getPosition(angle: number) {
  const r = 100;

  const startAngle = 225;

  return {
    x: Math.cos(deg2rad(startAngle - angle)) * r + 150 - 12.5,
    y: Math.sin(deg2rad(startAngle - angle)) * r + 150 - 12.5,
  };
}

export function WheelInput() {
  const [angle, setAngle] = useState(0);
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

          const x: number = d.clientX - parentRect.x;
          const y: number = d.clientY - parentRect.y;

          // diffs and distance from the center of the sphere
          const diffX = x - 150;
          const diffY = 150 - y;
          const dist = Math.sqrt(diffX ** 2 + diffY ** 2);

          const baseAngle = Math.asin(diffY / dist);
          const angle = diffX < 0 ? baseAngle : deg2rad(180) - baseAngle;

          console.log(baseAngle);

          const angleDeg = rad2deg(angle) + 45;

          setTempAngle(Math.min(Math.max(angleDeg, 0), 270));
        }}
        onStop={() => setAngle(tempAngle)}
      >
        <DragHandle style={{ left: handlePos.x, bottom: handlePos.y }} />
      </DraggableCore>

      <Blob style={{ left: blobPos.x, bottom: blobPos.y }} />

      <Marker angle={tempAngle} />

      <Background />
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

const Container = styled('div', {
  position: 'relative',
  height: 300,
});
