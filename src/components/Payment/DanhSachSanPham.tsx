import { useTheme } from '@mui/material';
import { CustomAccordionItem } from '@/components/Layouts/components/CustomAccordionItem';
import { DanhSachSanPham_Item } from './DanhSachSanPham_Item';

export function DanhSachSanPham(props: any) {
  const { Products } = props;
  const theme = useTheme();
  return (
    <>
      {Products.map((item: any, i: number) => (
        <CustomAccordionItem
          heading={item.name}
          key={i}
          defaultExpanded={i == 0 ? true : false}
          children={() => <DanhSachSanPham_Item item={item} />}
        />
      ))}
    </>
  );
}
