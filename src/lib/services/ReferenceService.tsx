import { where } from 'firebase/firestore';
import { getCollectionWithQuery } from '../firestore/firestoreLib';
import { Reference } from '../models/Reference';

interface ReferenceServiceInterface {
  getColors: () => Promise<string[]>;
  getSizes: () => Promise<string[]>;
}

class ReferencesService implements ReferenceServiceInterface {
  constructor() {}

  async getColors(): Promise<string[]> {
    try {
      const colors = await getCollectionWithQuery<Reference>(
        'references',
        where('name', '==', 'colors'),
      );

      return colors[0].values ?? [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getSizes(): Promise<string[]> {
    try {
      const sizes = await getCollectionWithQuery<Reference>(
        'references',
        where('name', '==', 'sizes'),
      );
      return sizes[0].values ?? [];
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
