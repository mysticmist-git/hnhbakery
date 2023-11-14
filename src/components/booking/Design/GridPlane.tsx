import React, {
  createContext,
  useRef,
  useContext,
  useCallback,
  useState,
} from 'react';
import { Vector3, Plane } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';

const v = new Vector3();
const p = new Plane(new Vector3(0, 1, 0), 0);
const context = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

function useDrag(onDrag: (v: Vector3) => void): any {
  const controls: any = useThree((state) => state.controls);

  const activatePlane = useContext(context); //activate á

  const [active, activate] = useState(false);

  const [hovered, hover] = useState(false);
  const out = useCallback(() => hover(false), []);
  const over = useCallback((e: any) => (e.stopPropagation(), hover(true)), []);

  const down = useCallback(
    (e: any) => {
      e.stopPropagation();
      activate(true);
      activatePlane && activatePlane(true);
      if (controls) controls.enabled = false;
      e.target.setPointerCapture(e.pointerId);
    },
    [controls, activatePlane]
  );

  const up = useCallback(
    (e: any) => {
      activate(false);
      activatePlane && activatePlane(false);
      if (controls) controls.enabled = true;
      e.target.releasePointerCapture(e.pointerId);
    },
    [controls, activatePlane]
  );

  const move = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (active && e.ray.intersectPlane(p, v)) onDrag(v);
    },
    [onDrag, active]
  );

  return [
    {
      onPointerOver: over,
      onPointerOut: out,
      onPointerDown: down,
      onPointerUp: up,
      onPointerMove: move,
    },
    active,
    hovered,
  ];
}

interface GridProps {
  children: React.ReactNode;
  scale: number;
  divisions?: number;
}

function GridPlane({ children, scale, divisions = 10, ...props }: GridProps) {
  const grid = useRef<THREE.GridHelper>(null!);
  const plane = useRef<THREE.Mesh>(null!);
  const [active, activate] = useState(false);

  useFrame((state, delta) => {
    easing.damp(grid.current.material, 'opacity', active ? 1 : 0.9, 0.1, delta);
  });

  return (
    <group {...props}>
      <group scale={scale}>
        <gridHelper ref={grid} args={[1, divisions, '#888', '#bbb']} />
        {/* <mesh receiveShadow ref={plane} rotation-x={-Math.PI / 2}>
          <planeGeometry />
          <meshStandardMaterial
            transparent
            color="lightblue"
            polygonOffset
            polygonOffsetUnits={1}
            polygonOffsetFactor={1}
          />
        </mesh> */}
      </group>
      <context.Provider value={activate}>{children}</context.Provider>
    </group>
  );
}

export { GridPlane };
