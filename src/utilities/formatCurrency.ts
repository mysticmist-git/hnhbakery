export default function formatPrice(price: number): string {
  const formatter = new Intl.NumberFormat('vi-VN');
  return formatter.format(price) + ' đồng';
}
