import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActiveDrag, DraggingContext, Primitive } from '../Model3D';
import {
  getPlane,
  getPositionFromPlaneId,
  getPositionFromPlaneIdAndGhim,
  getRotationFromPlaneId,
  useDrag,
} from '../Utils';
import { clamp } from 'three/src/math/MathUtils';
import { Box3, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { Model3DContext, Model3DProps } from '@/pages/booking';

function GroupDecor({ index }: { index: number }) {
  const { active, setActive, cakeBoundingBox } =
    React.useContext(DraggingContext);

  const { array: arrayModel, handleChangeContext } = useContext(Model3DContext);
  const { planeId, box3, scale, rotation, ghim } = arrayModel[index];

  const pos = useRef<[number, number, number] | null>(null);

  const onDrag = useCallback(
    (v: Vector3) => {
      if (!planeId || !cakeBoundingBox || !box3 || ghim == undefined) return;

      const plane = getPlane(planeId, cakeBoundingBox);
      if (!plane) {
        return;
      }

      const normal = plane.normal;

      if (normal.x != 0) {
        v.x = plane.constant;
        if (normal.x > 0) {
          v.x -= ghim;
        } else {
          v.x += ghim;
        }
      } else if (normal.y != 0) {
        v.y = plane.constant;
        if (normal.y > 0) {
          v.y -= ghim;
        } else {
          v.y += ghim;
        }
      } else if (normal.z != 0) {
        v.z = plane.constant;
        if (normal.z > 0) {
          v.z -= ghim;
        } else {
          v.z += ghim;
        }
      }

      pos.current = [
        clamp(v.x, cakeBoundingBox.min.x + ghim, cakeBoundingBox.max.x - ghim),
        clamp(v.y, cakeBoundingBox.min.y + ghim, cakeBoundingBox.max.y - ghim),
        clamp(v.z, cakeBoundingBox.min.z + ghim, cakeBoundingBox.max.z - ghim),
      ];
    },
    [planeId, cakeBoundingBox, box3, ghim]
  );

  const [events, hovered] = useDrag({ planeId: planeId, onDrag });

  useFrame((state, delta) => {
    if (pos.current) {
      easing.damp3(ref.current.position, pos.current, 0.3, delta);
    }
    if (rotation) {
      easing.dampE(ref.current.rotation, rotation, 0.3, delta);
    }
  });

  const ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (!cakeBoundingBox || !planeId) return;
    if (handleChangeContext) {
      const newValue = {
        ...arrayModel[index],
        rotation: getRotationFromPlaneId(planeId, cakeBoundingBox),
      };
      handleChangeContext('array', newValue, index);
    }
    if (!pos.current) {
      pos.current = getPositionFromPlaneId(planeId, cakeBoundingBox);
    }
  }, [planeId, cakeBoundingBox]);

  useEffect(() => {
    if (!cakeBoundingBox || !planeId || ghim == undefined || !pos.current)
      return;
    const v3 = new Vector3(pos.current[0], pos.current[1], pos.current[2]);
    onDrag(v3);
  }, [ghim]);

  return (
    <group ref={ref} {...events} scale={scale}>
      <Primitive index={index} />
    </group>
  );
}

export default GroupDecor;
