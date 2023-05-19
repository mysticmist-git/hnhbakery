import { db } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CollectionName } from '../models/utilities';

interface ReferenceServiceInterface {
  getColors: () => Promise<string[]>;
  getSizes: () => Promise<string[]>;
}

class ReferencesService implements ReferenceServiceInterface {
  constructor() {}

  async getColors(): Promise<string[]> {
    const referencesRef = collection(db, CollectionName.References);
    const referencesQuery = query(referencesRef, where('name', '==', 'colors'));

    try {
      const colorsSnapshot = await getDocs(referencesQuery);
      const colors: string[] = colorsSnapshot.docs[0].data().values ?? [];
      console.log(colors);

      return colors;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getSizes(): Promise<string[]> {
    const referencesRef = collection(db, CollectionName.References);
    const referencesQuery = query(referencesRef, where('name', '==', 'sizes'));
    try {
      const colorsSnapshot = await getDocs(referencesQuery);
      const sizes: string[] = colorsSnapshot.docs[0].data().values ?? [];
      console.log(sizes);

      return sizes;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

class ReferenceServiceProxy implements ReferenceServiceInterface {
  private service: ReferenceServiceInterface;
  private colors: string[];
  private sizes: string[];

  constructor(service: ReferenceServiceInterface) {
    this.service = service;
    this.colors = [];
    this.sizes = [];
  }

  async getColors(): Promise<string[]> {
    if (this.colors.length === 0) {
      // If the colors have not been cached yet, fetch them from the service
      this.colors = await this.service.getColors();
    }
    return this.colors;
  }

  async getSizes(): Promise<string[]> {
    if (this.sizes.length === 0) {
      // If the sizes have not been cached yet, fetch them from the service
      this.sizes = await this.service.getSizes();
    }
    return this.sizes;
  }
}

export { ReferenceServiceProxy, ReferencesService };
export type { ReferenceServiceInterface };
