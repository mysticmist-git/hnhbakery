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
  MathUtils,
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
  PerspectiveCamera,
} from '@react-three/drei';
import Backdrop from './Backdrop';
import React from 'react';
import GridBoudingBox from './GridBoudingBox';
import GroupDecor from './Decor/GroupDecor';
import { Model3DContext, Model3DProps } from '@/pages/booking';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/firebase/config';
import TableModel3D from './TableModel3D';
import { Box, Typography } from '@mui/material';
import CustomText3D from './CustomText3D';

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
  const {
    array: arrayModel,
    handleChangeContext,
    editIndex,
  } = useContext(Model3DContext);

  if (!arrayModel[index]) {
    return <></>;
  }
  const { path, textures } = arrayModel[index];
  if (!path) {
    return <></>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let loader = useLoader(OBJLoader, path);

  if (textures) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let texturesLoaded = useTexture(
      textures.filter((item) => item.path != '').map((item) => item.path)
    );

    let index = 0;
    loader.children.forEach((mesh: any, i) => {
      if (textures[i] && textures[i].path != '') {
        mesh.material = new MeshStandardMaterial({
          map: texturesLoaded[index++],
        });
      } else {
        mesh.material = new MeshStandardMaterial({
          color: 'white',
        });
      }
    });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!loader) return;

    const box3 = new Box3().setFromObject(loader);
    if (handleChangeContext) {
      const children: string[] = [];
      let count = 1;
      loader.children.forEach((item, i) => {
        if (item.name == 'Default') {
          children.push('Default_Phần ' + count++);
        } else {
          children.push(item.name);
        }
      });
      const newValue = {
        ...arrayModel[index],
        children: children,
        textures: children.map((item, i) => ({
          name: '',
          path: '',
        })),
        box3: {
          min: box3.min,
          max: box3.max,
        },
      };
      console.log(newValue);

      handleChangeContext('array', newValue, index);
    }

    if (handleCakeBoudingChange) {
      handleCakeBoudingChange(box3);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader]);

  return (
    <>
      <group
        onClick={() => {
          if (handleChangeContext && index !== editIndex) {
            handleChangeContext('editIndex', index);
          }
        }}
        onPointerOver={() => {
          window.document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          window.document.body.style.cursor = 'auto';
        }}
      >
        <primitive object={loader.clone()} />
      </group>
    </>
  );
}

function Model3D() {
  const { array: arrayModel } = useContext(Model3DContext);

  const [active, setActive] = useState<ActiveDrag>({ id: -1 });

  const [dragIndex, setDragIndex] = useState(-1);

  const [cakeBoundingBox, setCakeBoundingBox] = useState<Box3 | null>(null);

  const handleCakeBoudingChange = useCallback(
    (value: Box3) => {
      setCakeBoundingBox(value);
    },
    [setCakeBoundingBox]
  );

  return (
    <DraggingContext.Provider
      value={{ active, setActive, cakeBoundingBox, dragIndex, setDragIndex }}
    >
      <group scale={7} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <GridBoudingBox cakeBoundingBox={cakeBoundingBox}>
          {arrayModel &&
            arrayModel.map((item, index) => {
              if (index == 0) {
                return (
                  <Primitive
                    key={index}
                    index={0}
                    handleCakeBoudingChange={handleCakeBoudingChange}
                  />
                );
              } else {
                return <GroupDecor key={index} index={index} />;
              }
            })}
        </GridBoudingBox>
      </group>
    </DraggingContext.Provider>
  );
}

export const DraggingContext = createContext<{
  active: ActiveDrag;
  setActive: React.Dispatch<React.SetStateAction<ActiveDrag>>;
  cakeBoundingBox: Box3 | null;
  dragIndex: number;
  setDragIndex: React.Dispatch<React.SetStateAction<number>>;
}>({
  active: { id: -1 },
  setActive: () => {},
  cakeBoundingBox: new Box3(),
  dragIndex: -1,
  setDragIndex: () => {},
});

export default function Canvas3D({
  keyCanvas,
  setCanvas,
}: {
  keyCanvas: number;
  setCanvas: (state: RootState) => void;
}) {
  const { withRoomDesign, array } = useContext(Model3DContext);
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Canvas
          key={keyCanvas}
          onCreated={setCanvas}
          shadows
          camera={{
            fov: 75,
            position: [0, Math.PI / 3, 2.5],
          }}
          gl={{ preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%' }}
        >
          {withRoomDesign && <TableModel3D />}
          <ambientLight intensity={0.3} />
          <Environment preset="city" />
          <Center>
            <Model3D />
          </Center>
          <OrbitControls makeDefault />
        </Canvas>
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', color: 'grey.500' }}
        >
          Đang tải...
        </Typography>
      </Box>
    </>
  );
}
