export interface BillDetail {
  bill_Id: string;
  bill_State: number;
  bill_HinhThucThanhToan: string;
  bill_PaymentTime: string;
  bill_Note: string;
  bill_TongTien: number;
  bill_KhuyenMai: number;
  bill_ThanhTien: number;
}

export interface DeliveryDetail {
  deli_StaffName: string;
  deli_StaffPhone: string;
  deli_StartAt: string;
  deli_EndAt: string;
  deli_State: number;
  deli_CustomerName: string;
  deli_CustomerPhone: string;
  deli_CustomerTime: string;
  deli_CustomerAddress: string;
  deli_CustomerNote: string;
}

export interface SaleDetail {
  sale_Id: string;
  sale_Name: string;
  sale_Code: string;
  sale_Percent: number;
  sale_MaxSalePrice: number;
  sale_Description: string;
  sale_StartAt: string;
  sale_EndAt: string;
  sale_Image: any; // replace 'any' with the type of bfriday.src
}

export interface BillInfor {
  billDetail: BillDetail;
  saleDetail?: SaleDetail;
}

export interface BillproductDetail {
  size: string;
  material: string;
  amount: number;
  price: number;
  discount: number;
  discountPrice: number;
  MFG: string;
  EXP: string;
}

export interface ProductDetail {
  name: string;
  image: string;
  price: number;
  type: string;
  state: number;
  description: string;
  href: string;
}

export interface ProductInfor {
  bill_ProductDetail: BillproductDetail;
  productDetail: ProductDetail;
}
