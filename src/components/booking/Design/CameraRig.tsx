import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import React, { useRef } from 'react';

function CameraRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // set the initial position of the model
    // let targetPosition: [number, number, number] = [0, 0, 2.5];

    // // set model camera position
    // easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // set the model rotation smoothly
    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0],
        0.25,
        delta
      );
    }
  });
  return (
    <>
      <group ref={group}>{children}</group>;
    </>
  );
}

export default CameraRig;
