import { Height } from '@mui/icons-material';
import { GroupProps, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import React, { Ref, useContext, useEffect, useRef, useState } from 'react';
import THREE, {
  BoxGeometry,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  GridHelper,
  Group,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Vector3,
} from 'three';
import { DraggingContext } from './Model3D';
import { useTheme } from '@emotion/react';
import { createAGrid } from './Utils';

function GridBoudingBox({
  children,
  cakeBoundingBox,
  ...props
}: {
  children?: React.ReactNode;
  cakeBoundingBox: THREE.Box3 | null;
  [key: string]: any;
}) {
  const { active, setActive } = useContext(DraggingContext);
  const plane_0 = useRef<THREE.Group>(null!);
  const plane_1 = useRef<THREE.Group>(null!);
  const plane_2 = useRef<THREE.Group>(null!);
  const plane_3 = useRef<THREE.Group>(null!);
  const plane_4 = useRef<THREE.Group>(null!);
  const plane_5 = useRef<THREE.Group>(null!);

  const [material, setMaterial] = useState(
    new LineBasicMaterial({
      color: '#810000',
      transparent: true,
      opacity: 0.5,
    })
  );

  useEffect(() => {
    if (!cakeBoundingBox) return;
    // Tính toán kích thước của hình hộp
    const size = cakeBoundingBox.getSize(new Vector3());

    // Lấy trung tâm của hình hộp
    const center = cakeBoundingBox.getCenter(new Vector3());

    switch (active.id) {
      case 0:
        plane_0.current.add(
          createAGrid({
            height: Math.min(size.y / 2, size.x / 2),
            width: Math.max(size.y / 2, size.x / 2),
            material,
          })
        );
        plane_0.current.position.set(center.x, center.y, center.z + size.z / 2);
        break;
      case 1:
        plane_1.current.add(
          createAGrid({
            height: Math.min(size.y / 2, size.x / 2),
            width: Math.max(size.y / 2, size.x / 2),
            material,
          })
        );
        plane_1.current.position.set(center.x, center.y, center.z - size.z / 2);
        break;
      case 2:
        plane_2.current.add(
          createAGrid({
            height: Math.min(size.z / 2, size.x / 2),
            width: Math.max(size.z / 2, size.x / 2),
            material,
          })
        );
        plane_2.current.position.set(center.x, center.y + size.y / 2, center.z);
        break;
      case 3:
        plane_3.current.add(
          createAGrid({
            height: Math.min(size.z / 2, size.x / 2),
            width: Math.max(size.z / 2, size.x / 2),
            material,
          })
        );
        plane_3.current.position.set(center.x, center.y - size.y / 2, center.z);
        break;
      case 4:
        plane_4.current.add(
          createAGrid({
            height: Math.min(size.z / 2, size.y / 2),
            width: Math.max(size.z / 2, size.y / 2),
            material,
          })
        );
        plane_4.current.position.set(center.x + size.x / 2, center.y, center.z);
        break;
      case 5:
        plane_5.current.add(
          createAGrid({
            height: Math.min(size.z / 2, size.y / 2),
            width: Math.max(size.z / 2, size.y / 2),
            material,
          })
        );
        plane_5.current.position.set(center.x - size.x / 2, center.y, center.z);
        break;
      default:
    }
  }, [cakeBoundingBox, material, active]);

  return (
    <>
      <group {...props}>
        {active.id != -1 && (
          <>
            <group ref={plane_0} />
            <group ref={plane_1} />
            <group ref={plane_2} rotation={[Math.PI / 2, 0, 0]} />
            <group ref={plane_3} rotation={[Math.PI / 2, 0, 0]} />
            <group ref={plane_4} rotation={[0, Math.PI / 2, 0]} />
            <group ref={plane_5} rotation={[0, Math.PI / 2, 0]} />
          </>
        )}
        {children}
      </group>
    </>
  );
}

export default GridBoudingBox;
