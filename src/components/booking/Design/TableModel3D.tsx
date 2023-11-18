import { Model3DContext } from '@/pages/booking';
import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import React, { useContext, useMemo } from 'react';
import { Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function TableModel3D() {
  const [floor, tableCloth] = useTexture([
    './freepik/textures/floor.jpg',
    './freepik/textures/tableCloth.jpg',
  ]);

  const gblLoader = useLoader(GLTFLoader, './freepik/fruits.glb');
  const box3 = new Box3().setFromObject(gblLoader.scene);

  const size = 15;
  const height = 1;

  return (
    <>
      <group
        scale={0.005}
        position={[0, -height + (box3.max.y - box3.min.y) / 3.2, 0]}
      >
        <primitive object={gblLoader.scene} />
      </group>

      {/* Thảm */}
      <mesh
        position={[0, -height, 0]}
        scale={0.2}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={tableCloth} />
      </mesh>

      {/* Mặt đáy */}
      <mesh position={[0, -height - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={floor} />
      </mesh>

      {/* Trước mặt */}
      <mesh position={[0, size / 2 - height, -size / 2]} rotation={[0, 0, 0]}>
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={tableCloth} />
      </mesh>

      {/* Đằng sau */}
      <mesh
        position={[0, size / 2 - height, size / 2]}
        rotation={[Math.PI, 0, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={tableCloth} />
      </mesh>

      {/* Bên trái */}
      <mesh
        position={[-size / 2, size / 2 - height, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={tableCloth} />
      </mesh>

      {/* Bên phải */}
      <mesh
        position={[size / 2, size / 2 - height, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        <meshStandardMaterial map={tableCloth} />
      </mesh>
    </>
  );
}

export default TableModel3D;
