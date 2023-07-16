import banh1 from '@/assets/Carousel/3.jpg';
import bfriday from '@/assets/blackfriday.jpg';
import { createContext } from 'react';
import { BillInfor } from '../types/search';

export interface SearchContextType {
  billInfor: any;
  productInfor: any;
}

export const initSearchContext: SearchContextType = {
  billInfor: {},
  productInfor: [],
};

export const SearchContext =
  createContext<SearchContextType>(initSearchContext);

// #region Context

export interface SearchPageBill {}

// #endregion

const initBillInfor: BillInfor = {
  billDetail: {
    bill_Id: 'GUEST-123',
    bill_State: 1, //1:Thanh toán thành công, 0: Chờ thanh toán, -1:Hủy đơn hàng
    bill_HinhThucThanhToan: 'MoMo',
    bill_PaymentTime: '07:30 07/01/2023',
    bill_Note: 'Giảm 50% đường các loại bánh.',
    bill_TongTien: 1000000,
    bill_KhuyenMai: 500000,
    bill_ThanhTien: 500000,
  },
  // deliveryDetail: {
  //   deli_StaffName: 'Terisa',
  //   deli_StaffPhone: '0343214971',
  //   deli_StartAt: '07:30 07/01/2023',
  //   deli_EndAt: '07:55 07/01/2023',
  //   deli_State: 1, //1:Giao thành công, 0: Đang giao, -1: Giao thất bại
  //   deli_CustomerName: 'Trường Huy',
  //   deli_CustomerPhone: '0343214971',
  //   deli_CustomerTime: '08:00 07/01/2023',
  //   deli_CustomerAddress:
  //     '157 Đ. Nguyễn Chí Thanh, Phường 12, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
  //   deli_CustomerNote: 'Tới nơi nhấn chuông hoặc liên lạc qua SDT',
  // },
  saleDetail: {
    sale_Id: '123',
    sale_Name: 'SALE BLACK FRIDAY',
    sale_Code: 'BFD',
    sale_Percent: 5,
    sale_MaxSalePrice: 500000,
    sale_Description:
      'Thứ Sáu Đen là tên gọi không chính thức cho ngày thứ sáu sau Lễ Tạ Ơn và được coi là ngày mở hàng cho mùa mua sắm Giáng sinh của Mỹ.',
    sale_StartAt: '06/01/2023',
    sale_EndAt: '07/01/2023',
    sale_Image: bfriday.src,
  },
};

const initProductInfor = [
  {
    bill_ProductDetail: {
      size: 'lớn',
      material: 'dâu',
      amount: 100,
      price: 150000,
      discount: 30,
      discountPrice: 105000, //price* (1-discount/100),
      MFG: '07/01/2023',
      EXP: '07/01/2023',
    },
    productDetail: {
      name: 'Croissant',
      image: banh1.src,
      price: 150000,
      type: 'Bánh mặn',
      state: 1, // 1:Còn hàng, 0:Hết hàng, -1: Ngưng bán
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
  },
  {
    bill_ProductDetail: {
      size: 'lớn',
      material: 'dâu',
      amount: 1,
      price: 150000,
      discount: 30,
      discountPrice: 105000, //price* (1-discount/100),
      MFG: '07/01/2023',
      EXP: '07/01/2023',
    },
    productDetail: {
      name: 'Croissant',
      image: banh1.src,
      price: 150000,
      type: 'Bánh mặn',
      state: 1, // 1:Còn hàng, 0:Hết hàng, -1: Ngưng bán
      description:
        'Bánh sừng trâu với hình dáng tựa lưỡi liềm độc & lạ, cán ngàn lớp bơ Anchor, cho vị giòn rụm,...',
    },
  },
];
