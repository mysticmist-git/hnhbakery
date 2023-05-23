export interface OtherInfos {
  name: string;
  tel: string;
  email: string;
  diaChi: string;
  thoiGianGiao: string;
  ngayGiao: string;
  deliveryNote: string;
}

export type Ref = {
  getOtherInfos: () => OtherInfos;
} | null;
