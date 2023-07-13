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
  BILL_DETAILS: 'billDetails',
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
} as const;

type ObjectValues<T> = T[keyof T];

export type Routes = ObjectValues<typeof ROUTES>;
