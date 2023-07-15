import { CustomAccordionItem } from '@/components/accordions/CustomAccordionItem';
import { useTheme } from '@mui/material';
import DanhSachSanPham_Item from './DanhSachSanPham_Item';

export default function DanhSachSanPham(props: any) {
  const { Products } = props;
  const theme = useTheme();

  return (
    <>
      {Products.map((item: any, i: number) => (
        <CustomAccordionItem
          heading={item.product?.name ?? 'Sản phẩm'}
          key={i}
          defaultExpanded={i == 0 ? true : false}
          children={() => <DanhSachSanPham_Item item={item} />}
        />
      ))}
    </>
  );
}