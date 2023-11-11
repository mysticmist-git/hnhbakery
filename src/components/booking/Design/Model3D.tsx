import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, ThreeElements, useLoader, useThree } from '@react-three/fiber';
import { Box } from '@mui/material';
import THREE, { Box3, MeshStandardMaterial, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {
  Center,
  Environment,
  useTexture,
  Text,
  OrbitControls,
} from '@react-three/drei';
import CameraRig from './CameraRig';
import Backdrop from './Backdrop';

const colors = ['red', 'blue', 'green', 'purple'];

function BoxModel3D({ props }: { props?: ThreeElements['mesh'] }) {
  const decor1 = useLoader(OBJLoader, '/freepik/cupcake-topper.obj');
  const decor2 = useLoader(OBJLoader, '/freepik/cake-pop-with-tag-001.obj');

  const cake = useLoader(OBJLoader, '/freepik/cake-002.obj');
  // const cake = useLoader(
  //   OBJLoader,
  //   'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/model3D%2Fcake-001.obj?alt=media&token=b8035f02-67e2-4eae-b1b8-90aaeaf4d44c'
  // );

  const [strawberry, vani] = useTexture([
    '/freepik/textures/strawberry.png',
    '/freepik/textures/vani.png',
  ]);

  console.log(decor1.children);

  console.log(
    new MeshStandardMaterial({
      map: vani,
    })
  );

  decor1.children.forEach((mesh: any, i) => {
    mesh.material = new MeshStandardMaterial({
      map: i % 2 === 0 ? vani : strawberry,
    });
    // mesh.material = new MeshBasicMaterial({
    //   color: colors[i],
    // });
  });

  decor2.children.forEach((mesh: any, i) => {
    mesh.material = new MeshStandardMaterial({
      map: i % 2 !== 0 ? vani : strawberry,
    });
    // mesh.material = new MeshBasicMaterial({
    //   color: colors[i],
    // });
  });

  cake.children.forEach((mesh: any, i) => {
    mesh.material = new MeshStandardMaterial({
      map: i % 2 !== 0 ? vani : strawberry,
    });
    // mesh.material = new MeshBasicMaterial({
    //   color: colors[i],
    // });
    mesh.castShadow = true;
  });

  let sizeCake = new Vector3();
  new Box3().setFromObject(cake).getSize(sizeCake);

  let sizeDecor1 = new Vector3();
  new Box3().setFromObject(decor1).getSize(sizeDecor1);

  console.log(sizeCake);
  console.log(sizeDecor1);

  return (
    <group
      scale={10}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      castShadow
      dispose={null}
    >
      <group>
        <group position={[-0.08, 0.02, -0.03]} rotation={[0, 0, 0.2]}>
          <primitive object={decor1.clone()} castShadow dispose={null} />
          <Text
            scale={12 / 1200}
            position={[0, 0.075, 0.0015]}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            Hi
          </Text>
        </group>

        <group
          position={[
            sizeCake.x / 3,
            sizeCake.y - sizeDecor1.y / 4,
            sizeCake.z / 3,
          ]}
          rotation={[0, 0, -0.2]}
        >
          <primitive object={decor1.clone()} castShadow dispose={null} />
          <Text
            scale={12 / 1200}
            position={[0, 0.075, 0.0015]}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            Ha
          </Text>
        </group>
      </group>

      <group position={[0, 0.03, -0.03]} rotation={[0, 0, 0]} scale={0.7}>
        <primitive object={decor2.clone()} castShadow dispose={null} />
      </group>

      <primitive object={cake.clone()} castShadow dispose={null} />
    </group>
  );
}
export default function TESTMODEL({ setCanvas }: { setCanvas: any }) {
  return (
    <>
      <Canvas
        onCreated={setCanvas}
        shadows
        camera={{ fov: 75, position: [0, 0, 2.5] }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <Environment preset="city" />

        <CameraRig>
          <Backdrop />
          <Center>
            <BoxModel3D />
          </Center>
        </CameraRig>
        <OrbitControls />
      </Canvas>
    </>
  );
}
