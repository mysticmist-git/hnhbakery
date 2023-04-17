import {
  doc,
  DocumentData,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

export interface ProductTypeObject {
  id: string;
  productType_name: string;
  productType_description: string;
  productType_image: string;
  productType_isActive: boolean;
}

export default class ProductType {
  id: string;
  productType_name: string;
  productType_description: string;
  productType_image: string;
  productType_isActive: boolean;

  constructor(
    id: string,
    productType_name: string,
    productType_description: string,
    productType_image: string,
    productType_isActive: boolean,
  ) {
    this.id = id;
    this.productType_name = productType_name;
    this.productType_description = productType_description;
    this.productType_image = productType_image;
    this.productType_isActive = productType_isActive;
  }

  static fromObject(productTypeObject: ProductTypeObject): ProductType {
    return new ProductType(
      productTypeObject.id,
      productTypeObject.productType_name,
      productTypeObject.productType_description,
      productTypeObject.productType_image,
      productTypeObject.productType_isActive,
    );
  }
}

// export const ProductTypeConverter = {
//   toFirestore(productType: ProductType): ProductTypeObject {
//     return {
//       id: productType.id,
//       productType_name: productType.productType_name,
//       productType_description: productType.productType_description,
//       productType_image: productType.productType_image,
//       productType_isActive: productType.productType_isActive,
//     };
//   },
//   fromFirestore(snapshot: QueryDocumentSnapshot): ProductType {
//     const data: ProductTypeObject = {
//       id: snapshot.id,
//       ...snapshot.data(),
//     } as ProductTypeObject;
//     return new ProductType(
//       data.id,
//       data.productType_name,
//       data.productType_description,
//       data.productType_image,
//       data.productType_isActive,
//     );
//   },
// };
