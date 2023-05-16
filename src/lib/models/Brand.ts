import {
  doc,
  DocumentData,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

export interface BrandObject {
  id: string;
  brand_name: string;
  brand_description: string;
}

export default class Brand {
  id: string;
  brand_name: string;
  brand_description: string;

  constructor(id: string, brand_name: string, brand_description: string) {
    this.id = id;
    this.brand_name = brand_name;
    this.brand_description = brand_description;
  }

  static fromObject(brandObject: BrandObject): Brand {
    return new Brand(
      brandObject.id,
      brandObject.brand_name,
      brandObject.brand_description,
    );
  }
}
