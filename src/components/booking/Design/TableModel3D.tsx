import { useTexture } from '@react-three/drei';
import React, { useContext, useMemo } from 'react';
import floorTexture from '@/assets/Textures/floor.jpg';
import wallTexture from '@/assets/Textures/wall.jpg';

function TableModel3D() {
  const [floor, wall] = useTexture([floorTexture.src, wallTexture.src]);

  const size = 10;
  const height = 1;

  return (
    <>
      {/* Thảm */}
      {/* <mesh
        position={[0, -height, 0]}
        scale={0.5}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={wall} />
      </mesh> */}

      {/* Mặt đáy */}
      <mesh position={[0, -height - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={floor} />
      </mesh>

      {/* Trước mặt */}
      <mesh position={[0, size / 2 - height, -size / 2]} rotation={[0, 0, 0]}>
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={wall} />
      </mesh>

      {/* Đằng sau */}
      <mesh
        position={[0, size / 2 - height, size / 2]}
        rotation={[Math.PI, 0, Math.PI]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={wall} />
      </mesh>

      {/* Bên trái */}
      <mesh
        position={[-size / 2, size / 2 - height, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={wall} />
      </mesh>

      {/* Bên phải */}
      <mesh
        position={[size / 2, size / 2 - height, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={wall} />
      </mesh>
    </>
  );
}

export default TableModel3D;
