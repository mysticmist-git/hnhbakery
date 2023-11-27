import {
  Suspense,
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, OrbitControls, Center, useTexture } from '@react-three/drei';
import { suspend } from 'suspend-react';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { Box } from '@mui/material';
import { DraggingContext } from './Model3D';
import { easing } from 'maath';
import { Box3, MeshStandardMaterial, Vector3 } from 'three';
import { Model3DContext } from '@/pages/booking';

export default function CustomText3D({ index }: { index: number }) {
  const [fontFileUrl, setFontFileUrl] = useState('/fonts/Roboto-Light.ttf');
  const font: any = suspend(() => {
    const loader = new TTFLoader();
    return new Promise((resolve) => {
      loader.load(fontFileUrl, resolve);
    });
  }, [fontFileUrl]);

  const ref = useRef<any>(null);

  const {
    array: arrayModel,
    handleChangeContext,
    editIndex,
  } = useContext(Model3DContext);

  if (!arrayModel[index]) {
    return <></>;
  }

  const { children, textures, scale } = arrayModel[index];

  const configNumber = useMemo(() => {
    if (scale) {
      return (7 * scale - 2.5) / 10000;
    } else {
      return 0.0008;
    }
  }, [scale]);

  if (!children) {
    return <></>;
  }

  const material = useRef<any>(
    new MeshStandardMaterial({
      color: 'pink',
    })
  );

  if (textures) {
    let texturesLoaded = useTexture(
      textures.filter((item) => item.path != '').map((item) => item.path)
    );
    if (texturesLoaded[0] != undefined) {
      material.current = new MeshStandardMaterial({
        map: texturesLoaded[0],
      });
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.material = material.current;
    }
  }, [material.current]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const box3 = new Box3().setFromObject(ref.current);

    if (handleChangeContext) {
      let child = '';
      if (children.length == 0 || children[0] == '') {
        child = 'text';
      } else {
        child = children[0];
      }
      const newValue = {
        ...arrayModel[index],
        children: [child],
        textures: [
          {
            name: '',
            path: '',
          },
        ],
        box3: {
          min: box3.min,
          max: box3.max,
        },
      };
      console.log(newValue);
      handleChangeContext('array', newValue, index);
    }
  }, []);

  return (
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
      <Center>
        <Text3D
          ref={ref}
          font={font}
          height={configNumber} // Độ dày
          bevelEnabled // Gọt cạnh - bo tròn
          bevelSize={configNumber} // Độ múp khi bo tròn
          bevelThickness={configNumber}
          lineHeight={0.5}
          letterSpacing={0}
          size={configNumber * 25}
        >
          {children[0] == '' ? 'Text' : children[0]}
        </Text3D>
      </Center>
    </group>
  );
}
