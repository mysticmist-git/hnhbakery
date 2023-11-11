import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import React, { useRef } from 'react';

function Backdrop() {
  const shadows = useRef<any>();
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.25}
      //   scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -1]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.95}
        ambient={0.45}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.75}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
}

export default Backdrop;
