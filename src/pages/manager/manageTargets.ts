import { CollectionName } from '@/lib/models/utilities';
import { GridColDef } from '@mui/x-data-grid';

export type FieldType = 'text' | 'isActive' | 'reference' | 'array' | 'detail';

export interface FieldInfo {
  fieldType: FieldType;
  reference?: CollectionName; // This is for when the field is a foreign key
  column: GridColDef;
}

export interface CrudTarget {
  name: string;
  collectionName: CollectionName;
  fieldInfos: FieldInfo[];
  detail?: CrudTarget;
  references?: CollectionName[];
}

const initialCrudTargets: CrudTarget[] = [
  {
    name: 'Loại sản phẩm',
    collectionName: CollectionName.ProductTypes,
    fieldInfos: [
      {
        fieldType: 'text',
        column: { field: 'id', headerName: 'ID', width: 200 },
      },
      {
        fieldType: 'text',
        column: {
          field: 'productType_name',
          headerName: 'Tên loại',
          width: 130,
        },
      },
      {
        fieldType: 'text',
        column: {
          field: 'productType_description',
          headerName: 'Miêu tả',
          width: 130,
        },
      },
      {
        fieldType: 'text',
        column: { field: 'productType_image', headerName: 'Ảnh', width: 90 },
      },
      {
        fieldType: 'isActive',
        column: {
          field: 'productType_isActive',
          valueFormatter(params) {
            return params.value ? 'Còn cung cấp' : 'Ngưng cung cấp';
          },
          headerName: 'Trạng thái',
          width: 120,
        },
      },
    ],
  },
  {
    name: 'Thương hiệu',
    collectionName: CollectionName.Brands,
    fieldInfos: [
      {
        fieldType: 'text',
        column: { field: 'id', headerName: 'ID', width: 200 },
      },
      {
        fieldType: 'text',
        column: { field: 'brand_name', headerName: 'Tên loại', width: 200 },
      },
      {
        fieldType: 'text',
        column: {
          field: 'brand_description',
          headerName: 'Miêu tả',
          width: 400,
        },
      },
    ],
  },
  {
    name: 'Sản phẩm',
    collectionName: CollectionName.Products,
    fieldInfos: [
      {
        fieldType: 'text',
        column: { field: 'id', headerName: 'ID', width: 200 },
      },
      {
        fieldType: 'text',
        column: {
          field: 'product_name',
          headerName: 'Tên sản phẩm',
          width: 200,
        },
      },
      {
        fieldType: 'text',
        column: {
          field: 'product_description',
          headerName: 'Miêu tả',
          width: 400,
        },
      },
      {
        fieldType: 'reference',
        reference: CollectionName.ProductTypes,
        column: {
          field: 'productType_id',
          headerName: 'Loại sản phẩm',
          width: 400,
        },
      },
      {
        fieldType: 'reference',
        reference: CollectionName.Brands,
        column: {
          field: 'brand_id',
          headerName: 'Thương hiệu',
          width: 400,
        },
      },
      {
        fieldType: 'isActive',
        column: {
          field: 'product_isActive',
          valueFormatter(params) {
            return params.value ? 'Còn cung cấp' : 'Ngưng cung cấp';
          },
          headerName: 'Trạng thái',
          width: 120,
        },
      },
      {
        fieldType: 'detail',
        column: {
          field: 'productDetail_id',
          headerName: '',
          width: 0,
        },
      },
    ],
    detail: {
      name: 'Chi tiết Sản phẩm',
      collectionName: CollectionName.ProductDetails,
      fieldInfos: [
        {
          fieldType: 'array',
          column: {
            field: 'productDetail_ingredients',
            headerName: 'Nguyên liệu',
          },
        },
        {
          fieldType: 'text',
          column: {
            field: 'productDetail_howToUse',
            headerName: 'Cách sử dụng',
          },
        },
        {
          fieldType: 'text',
          column: {
            field: 'productDetail_preservation',
            headerName: 'Bảo quản',
          },
        },
        {
          fieldType: 'array',
          column: {
            field: 'productDetail_images',
            headerName: 'Tên sản phẩm',
          },
        },
        {
          fieldType: 'array',
          column: {
            field: 'productDetail_colors',
            headerName: 'Màu sắc',
          },
        },
        {
          fieldType: 'array',
          column: {
            field: 'productDetail_sizes',
            headerName: 'Kích cỡ',
          },
        },
        {
          fieldType: 'array',
          column: {
            field: 'productDetail_materials',
            headerName: 'Vật liệu',
          },
        },
      ],
    },
  },
];

export default initialCrudTargets;
