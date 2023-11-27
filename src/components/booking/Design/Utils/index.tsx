import { useThree } from '@react-three/fiber';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import THREE, {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Object3DEventMap,
  Plane,
  Vector3,
} from 'three';
import { ActiveDrag, DraggingContext } from '../Model3D';
import {
  Model3DContext,
  Model3DProps,
  Model3DPropsType,
} from '@/pages/booking';
import { storage } from '@/firebase/config';
import { getDownloadURL, ref } from 'firebase/storage';

export function createAGrid(opts?: any) {
  var config = opts || {
    height: 60,
    width: 30,
    material: new LineBasicMaterial({
      color: 'black',
      transparent: true,
      opacity: 0.1,
    }),
  };

  let division =
    config.width > config.height
      ? Math.round(config.width / config.height)
      : Math.round(config.height / config.width);

  config.linesHeight = division;
  config.linesWidth = division * division;

  const points = [];

  //   chia lưới
  //   var stepw = (2 * config.width) / config.linesWidth;
  //   var steph = (2 * config.height) / config.linesHeight;
  //   không lưới
  var stepw = 2 * config.width;
  var steph = 2 * config.height;

  // Add horizontal lines
  for (var i = -config.height; i <= config.height; i += steph) {
    points.push(new Vector3(-config.width, i, 0));
    points.push(new Vector3(config.width, i, 0));
  }

  //   Add vertical lines
  for (var i = -config.width; i <= config.width; i += stepw) {
    points.push(new Vector3(i, -config.height, 0));
    points.push(new Vector3(i, config.height, 0));
  }

  var gridGeo = new BufferGeometry().setFromPoints(points);
  var line = new LineSegments(gridGeo, config.material);

  return line;
}
const v = new Vector3();
export function getPlane(
  planeId: ActiveDrag | undefined,
  cakeBoundingBox: THREE.Box3 | null
) {
  if (!planeId || planeId.id < 0) return null;
  if (!cakeBoundingBox) return null;
  const size = cakeBoundingBox.getSize(new Vector3());
  let constant = 0;
  switch (planeId.id) {
    case 0:
      constant = size.z / 2;
      break;
    case 1:
      constant = -size.z / 2;
      break;
    case 2:
      constant = size.y;
      break;
    case 3:
      constant = 0;
      break;
    case 4:
      constant = size.x / 2;
      break;
    case 5:
      constant = -size.x / 2;
      break;
  }
  return new Plane(getVector3FromPlaneId(planeId), constant);
}
export function useDrag({
  planeId,
  onDrag,
  index,
}: {
  planeId: ActiveDrag | undefined;
  onDrag: (v: Vector3) => void;
  index: number;
}): any {
  if (!planeId) {
    return () => {};
  }
  const controls: any = useThree((state) => state.controls);

  const { active, setActive, cakeBoundingBox, dragIndex, setDragIndex } =
    useContext(DraggingContext);

  const [hovered, hover] = useState(false);

  const out = useCallback(() => hover(false), []);
  const over = useCallback((e: any) => (e.stopPropagation(), hover(true)), []);

  const down = useCallback(
    (e: any) => {
      e.stopPropagation();
      setActive(planeId);
      setDragIndex(index);
      if (controls) controls.enabled = false;
      e.target.setPointerCapture(e.pointerId);
    },
    [controls, setActive]
  );

  const up = useCallback(
    (e: any) => {
      setActive({ id: -1 });
      setDragIndex(-1);
      if (controls) controls.enabled = true;
      e.target.releasePointerCapture(e.pointerId);
    },
    [controls, setActive]
  );

  const move = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (
        active.id != -1 &&
        dragIndex == index &&
        e.ray.intersectPlane(getPlane(planeId, cakeBoundingBox), v)
      )
        onDrag(v);
    },
    [onDrag, active]
  );

  return [
    {
      onPointerOver: over,
      onPointerOut: out,
      onPointerDown: down,
      onPointerUp: up,
      onPointerMove: move,
    },
    hovered,
  ];
}

export function getVector3FromPlaneId(planeId: ActiveDrag) {
  switch (planeId.id) {
    case 0:
      return new Vector3(0, 0, 1);
    case 1:
      return new Vector3(0, 0, -1);
    case 2:
      return new Vector3(0, 1, 0);
    case 3:
      return new Vector3(0, -1, 0);
    case 4:
      return new Vector3(1, 0, 0);
    case 5:
      return new Vector3(-1, 0, 0);
  }
}

export function getPositionFromPlaneId(
  planeId: ActiveDrag,
  cakeBoundingBox: THREE.Box3 | null
): [number, number, number] {
  if (!cakeBoundingBox || planeId.id < 0) {
    return [0, 0, 0];
  }

  const plane = getPlane(planeId, cakeBoundingBox);
  if (plane) {
    const normal = plane.normal;
    if (normal.x != 0) {
      return [plane.constant, 0, 0];
    } else if (normal.y != 0) {
      return [0, plane.constant, 0];
    } else if (normal.z != 0) {
      return [0, 0, plane.constant];
    }
  }
  return [0, 0, 0];
}

export function getPositionFromPlaneIdAndGhim(
  planeId: ActiveDrag,
  cakeBoundingBox: THREE.Box3 | null,
  ghim: number
): [number, number, number] {
  if (!cakeBoundingBox || planeId.id < 0) {
    return [0, 0, 0];
  }

  const plane = getPlane(planeId, cakeBoundingBox);
  if (plane) {
    const normal = plane.normal;
    let direct = 0;
    let result: [number, number, number] = [0, 0, 0];
    if (normal.x != 0) {
      direct = normal.x > 0 ? 1 : -1;
      result = [ghim, 0, 0];
    } else if (normal.y != 0) {
      direct = normal.y > 0 ? 1 : -1;
      result = [0, ghim, 0];
    } else if (normal.z != 0) {
      direct = normal.z > 0 ? 1 : -1;
      result = [0, 0, ghim];
    }
    direct = direct * -1;
    return [result[0] * direct, result[1] * direct, result[2] * direct];
  }
  return [0, 0, 0];
}

export function getRotationFromPlaneId(
  planeId: ActiveDrag | undefined,
  cakeBoundingBox: THREE.Box3 | null
): [number, number, number] {
  if (!cakeBoundingBox || !planeId || planeId.id < 0) {
    return [0, 0, 0];
  }
  const plane = getPlane(planeId, cakeBoundingBox);
  if (plane) {
    const normal = plane.normal;
    if (normal.x != 0) {
      if (normal.x > 0) {
        return [0, Math.PI / 2, 0];
      } else {
        return [0, -Math.PI / 2, 0];
      }
    } else if (normal.y != 0) {
      if (normal.y > 0) {
        return [0, 0, 0];
      } else {
        // Ghim dưới đáy
        // return [-Math.PI, 0, 0];
        return [0, 0, 0];
      }
    } else if (normal.z != 0) {
      if (normal.z > 0) {
        return [0, 0, 0];
      } else {
        return [-Math.PI, 0, 0];
      }
    }
  }
  return [0, 0, 0];
}

export function createModel3DItem({
  path,
  children,
  textures,
  scale,
  planeId,
  rotation,
  box3,
  ghim,
}: Model3DProps) {
  return {
    path: path,
    children: children ?? [],
    textures: textures ?? [],
    scale: scale || 1,
    planeId: planeId ?? { id: -1 },
    rotation: rotation ?? [0, 0, 0],
    box3: box3 ?? {
      min: new Vector3(),
      max: new Vector3(),
    },
    ghim: ghim ?? 0,
    isShow: true,
  } as Model3DProps;
}