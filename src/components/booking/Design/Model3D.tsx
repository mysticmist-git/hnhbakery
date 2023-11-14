import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Canvas, RootState, useLoader } from '@react-three/fiber';
import {
  Box3,
  Group,
  MeshStandardMaterial,
  Object3DEventMap,
  Texture,
  Vector3,
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {
  Center,
  Environment,
  useTexture,
  OrbitControls,
} from '@react-three/drei';
import Backdrop from './Backdrop';
import React from 'react';
import GridBoudingBox from './GridBoudingBox';
import GroupDecor from './Decor/GroupDecor';
import { Model3DContext, Model3DProps } from '@/pages/booking';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/firebase/config';

// -1 = none
// 0 = mặt trước
// 1 = mặt sau
// 2 = mặt trên
// 3 = mặt dưới
// 4 = mặt phải
// 5 = mặt trái

export type ActiveDrag = {
  id: -1 | 0 | 1 | 2 | 3 | 4 | 5;
};

export function Primitive({
  index,
  handleCakeBoudingChange,
}: {
  index: number;
  handleCakeBoudingChange?: (value: Box3) => void;
}) {
  const { array: arrayModel, handleChangeContext } = useContext(Model3DContext);
  const { path, textures } = arrayModel[index];

  let loader = useLoader(OBJLoader, path);

  if (textures) {
    let texturesLoaded = useTexture(textures.map((item) => item.path));
    loader.children.forEach((mesh: any, i) => {
      if (texturesLoaded[i]) {
        mesh.material = new MeshStandardMaterial({
          map: texturesLoaded[i],
        });
      } else {
        mesh.material = new MeshStandardMaterial({
          color: 'white',
        });
      }
    });
  }

  // useEffect(() => {
  //   if (!texturesLoaded) {
  //     return;
  //   }
  //   console.log(texturesLoaded);

  //   loader.children.forEach((mesh: any, i) => {
  //     if (texturesLoaded[i]) {
  //       mesh.material = new MeshStandardMaterial({
  //         map: texturesLoaded[i],
  //       });
  //     } else {
  //       mesh.material = new MeshStandardMaterial({
  //         color: 'white',
  //       });
  //     }
  //   });
  // }, [texturesURL]);

  useEffect(() => {
    if (!loader) return;

    const box3 = new Box3().setFromObject(loader);
    if (handleChangeContext) {
      const newValue = {
        ...arrayModel[index],
        children: loader.children.map((item) => item.name),
        box3: {
          min: box3.min,
          max: box3.max,
        },
      };

      handleChangeContext('array', newValue, index);
    }

    if (handleCakeBoudingChange) {
      handleCakeBoudingChange(box3);
    }
  }, [loader]);

  return (
    <>
      <primitive object={loader.clone()} />
    </>
  );
}

function Model3D() {
  const { array: arrayModel } = useContext(Model3DContext);

  const [active, setActive] = useState<ActiveDrag>({ id: -1 });

  const [cakeBoundingBox, setCakeBoundingBox] = useState<Box3 | null>(null);

  const handleCakeBoudingChange = useCallback(
    (value: Box3) => {
      setCakeBoundingBox(value);
    },
    [setCakeBoundingBox]
  );

  return (
    <DraggingContext.Provider value={{ active, setActive, cakeBoundingBox }}>
      <group scale={10} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <GridBoudingBox cakeBoundingBox={cakeBoundingBox}>
          {arrayModel[0].path && (
            <Primitive
              index={0}
              handleCakeBoudingChange={handleCakeBoudingChange}
            />
          )}

          {arrayModel[1].path && <GroupDecor index={1} />}
        </GridBoudingBox>
      </group>
    </DraggingContext.Provider>
  );
}

export const DraggingContext = createContext<{
  active: ActiveDrag;
  setActive: React.Dispatch<React.SetStateAction<ActiveDrag>>;
  cakeBoundingBox: Box3 | null;
}>({
  active: { id: -1 },
  setActive: () => {},
  cakeBoundingBox: new Box3(),
});

export default function Canvas3D({
  setCanvas,
}: {
  setCanvas: (state: RootState) => void;
}) {
  return (
    <>
      <Canvas
        onCreated={setCanvas}
        shadows
        camera={{ fov: 75, position: [0, 0, 2.5] }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <Environment preset="city" />

        {/* <CameraRig>
        </CameraRig> */}
        <Backdrop />
        <Center>
          <Model3D />
        </Center>
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
}
