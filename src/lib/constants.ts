export const authMessages = {
  signInSucesful: 'Đăng nhập thành công',
  signInFailed: 'Đăng nhập không thành công',
  emailExisted: 'Email đã tồn tại',
  networkError: 'Không thể kết nối với máy chủ',
  error: 'Lỗi',
};

export const COLLECTION_NAME = {
  PRODUCT_TYPES: 'product_types',
  PRODUCTS: 'products',
  VARIANTS: 'variants',
  BATCHES: 'batches',
  BRANDS: 'brands',
  BRANCHES: 'branches',
  FEEDBACKS: 'feedbacks',
  BILL_DETAILS: 'bill_details',
  DELIVERIES: 'deliveries',
  CONTACTS: 'contacts',
  BILLS: 'bills',
  BILL_ITEMS: 'bill_items',
  PAYMENTS: 'payments',
  SALES: 'sales',
  REFERENCES: 'references',
  GROUPS: 'groups',
  DEFAULT_USERS: 'default_users', // This for user just created
  USERS: 'users',
  USER_GROUPS: 'userGroups',
  PERMISSIONS: 'permissions',
  INGREDIENTS: 'ingredients',
  MATERIALS: 'materials',
  COLORS: 'colors',
  SIZES: 'sizes',
  ADDRESSES: 'addresses',
  PAYMENT_METHODS: 'payment_methods',
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
  STORAGE: '/manager/storage',
};

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

export enum Path {
  HOME = '/',
  SEARCH = '/search',
  PRODUCTS = '/products',
  ABOUT = '/about',
  CONTACT = '/contact',
  PRODUCT_DETAIL = '/product-detail',
  MANAGER = '/manager',
  CART = '/cart',
  PAYMENT = '/payment',
  LOGIN = '/auth/login',
  SIGN_UP = '/auth/signup',
  PROFILE = '/profile',
}

export const PLACEHOLDER_DELIVERY_PRICE = 20000;

/**
 * Enum representing permission codes.
 */
export enum PermissionCode {
  /**
   * Kho Doanh nghiệp
   */
  KHO1,

  /**
   * Kho chi nhánh
   */
  KHO2,

  /**
   * Phân quyền
   */
  PQ,

  /**
   * Đơn hàng
   */
  DH,

  /**
   * Khách hàng
   */
  KH,

  /**
   * Báo cáo
   */
  BC,

  /**
   * Giao hàng
   */
  GH,

  /**
   * Liên hệ
   */
  LH,

  /**
   * Khuyến mãi
   */
  KM,

  /**
   * Phản hồi
   */
  FB,

  /**
   * Chi nhánh
   */
  CN,
}

export const permissionToCodeMap = new Map<PermissionCode, string>([
  [PermissionCode.KHO1, 'KHO1'],
  [PermissionCode.KHO2, 'KHO2'],
  [PermissionCode.PQ, 'PQ'],
  [PermissionCode.DH, 'ĐH'],
  [PermissionCode.KH, 'KH'],
  [PermissionCode.BC, 'BC'],
  [PermissionCode.GH, 'GH'],
  [PermissionCode.LH, 'LH'],
  [PermissionCode.KM, 'KM'],
  [PermissionCode.FB, 'FB'],
  [PermissionCode.CN, 'CN'],
]);

export const PERMISSION_ROUTES = {
  [PermissionCode.KHO1]: '/manager/storage',
  [PermissionCode.KHO2]: '/manager/branch-storage',
  [PermissionCode.PQ]: '/manager/authorize',
  [PermissionCode.DH]: '/manager/orders',
  [PermissionCode.KH]: '/manager/customers',
  [PermissionCode.BC]: '/manager/reports',
  [PermissionCode.GH]: '/manager/deliveries',
  [PermissionCode.LH]: '/manager/contacts',
  [PermissionCode.KM]: '/manager/sales',
  [PermissionCode.FB]: '/manager/feedbacks',
  [PermissionCode.CN]: '/manager/branches',
};

export const permissionRouteMap = new Map([
  [PermissionCode.KHO1, PERMISSION_ROUTES[PermissionCode.KHO1]],
  [PermissionCode.KHO2, PERMISSION_ROUTES[PermissionCode.KHO2]],
  [PermissionCode.PQ, PERMISSION_ROUTES[PermissionCode.PQ]],
  [PermissionCode.DH, PERMISSION_ROUTES[PermissionCode.DH]],
  [PermissionCode.KH, PERMISSION_ROUTES[PermissionCode.KH]],
  [PermissionCode.BC, PERMISSION_ROUTES[PermissionCode.BC]],
  [PermissionCode.GH, PERMISSION_ROUTES[PermissionCode.GH]],
  [PermissionCode.LH, PERMISSION_ROUTES[PermissionCode.LH]],
  [PermissionCode.KM, PERMISSION_ROUTES[PermissionCode.KM]],
  [PermissionCode.FB, PERMISSION_ROUTES[PermissionCode.FB]],
  [PermissionCode.CN, PERMISSION_ROUTES[PermissionCode.CN]],
]);
