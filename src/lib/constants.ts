export const authMessages = {
  signInSucesful: 'Đăng nhập thành công',
  signInFailed: 'Đăng nhập không thành công',
  emailExisted: 'Email đã tồn tại',
  networkError: 'Không thể kết nối với máy chủ',
  error: 'Lỗi',
};

export const COLLECTION_NAME = {
  PRODUCT_TYPES: 'productTypes',
  PRODUCTS: 'products',
  BATCHES: 'batches',
  BRANDS: 'brands',
  PRODUCT_DETAILS: 'productDetails',
  FEEDBACKS: 'feedbacks',
  BILL_DETAILS: 'bill_details',
  DELIVERIES: 'deliveries',
  CARTS: 'carts',
  BILLS: 'bills',
  PAYMENTS: 'payments',
  SALES: 'sales',
  REFERENCES: 'references',
  USERS: 'users',
  STAFFS: 'staffs',
  ROLES: 'roles',
  RIGHT_ROLES: 'right_Roles',
  RIGHTS: 'rights',
  NONE: 'none',
};

export const LOCAL_CART_KEY: string = 'cart';

export const DETAIL_PATH = '/product-detail';

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  PRODUCTS: '/products',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRODUCT_DETAIL: '/product-detail',
  MANAGER: '/manager',
  CART: '/cart',
  PAYMENT: '/payment',
} as const;

type ObjectValues<T> = T[keyof T];

export type Routes = ObjectValues<typeof ROUTES>;

export const NOTE_KEY = 'note';

export const MocGioGiaoHang = [
  {
    value: 'Buổi sáng (07:30 - 11:30)',
    label: 'Buổi sáng',
    description: '(07:30 - 11:30)',
  },
  {
    value: 'Buổi trưa (11:30 - 13:00)',
    label: 'Buổi trưa',
    description: '(11:30 - 13:00)',
  },
  {
    value: 'Buổi chiều (13:00 - 17:00)',
    label: 'Buổi chiều',
    description: '(13:00 - 17:00)',
  },
  {
    value: 'Buổi tối (17:00 - 21:00)',
    label: 'Buổi tối',
    description: '(17:00 - 21:00)',
  },
  {
    value: 'Cụ thể',
    label: 'Cụ thể',
    description: 'Chọn mốc thời gian',
  },
];

export const PLACEHOLDER_DELIVERY_PRICE = 100000;
