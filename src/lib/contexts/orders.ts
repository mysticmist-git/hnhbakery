export const billStatusParse = (state: number) => {
  switch (state) {
    case -1:
      return 'Hủy';
    case 0:
      return 'Chưa thanh toán';
    case 1:
      return 'Đã thanh toán';
    default:
      return 'Lỗi';
  }
};
