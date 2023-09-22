import Size from '@/models/size';
import { getSizeRef } from './sizeDAO';

export async function updateSize(id: string, data: Size) {
  return await updateDoc(getSizeRef(id), data);
}
