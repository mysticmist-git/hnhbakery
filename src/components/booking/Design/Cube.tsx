import React, { useCallback, useRef, useEffect } from 'react';
import { MeshProps, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MathUtils, Color } from 'three';
import { easing } from 'maath';
import { useDrag } from './GridPlane';

export function Cube({
  position = [0.5, 0.5, -0.5],
  c = new Color(),
  round = Math.round,
  clamp = MathUtils.clamp,
  ...props
}: {
  position?: [number, number, number];
  c?: Color;
  round?: (x: number) => number;
  clamp?: (x: number, min: number, max: number) => number;
  props?: MeshProps;
}) {
  const ref = useRef<any>(null!);
  const pos = useRef(position);
  const onDrag = useCallback(({ x, z }: { x: number; z: number }) => {
    pos.current = [
      round(clamp(x, -5, 4)) + 0.5,
      position[1],
      round(clamp(z, -5, 4)) + 0.5,
    ];
  }, []);
  const [events, active, hovered] = useDrag(onDrag);

  useEffect(() => {
    document.body.style.cursor = active
      ? 'grabbing'
      : hovered
      ? 'grab'
      : 'auto';
  }, [active, hovered]);

  useFrame((state, delta) => {
    easing.damp3(ref.current.position, pos.current, 0.1, delta);
    easing.dampC(
      ref.current.material!.color,
      active
        ? new Color('white')
        : hovered
        ? new Color('lightblue')
        : new Color('orange'),
      0.1,
      delta
    );
  });

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      {...events}
      {...props}
      onClick={(e) => e.stopPropagation()}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
