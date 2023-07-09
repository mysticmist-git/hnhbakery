import { useTheme } from '@mui/material';
import RenderSaleItem from './RenderSaleItem';
export default function RenderSale(props: any) {
  const theme = useTheme();
  const { handleChooseSale, chosenSale } = props;
  const { Sales = [] }: { Sales: SaleObject[] } = props;

  return (
    <>
      {Sales.map((sale: any, i: number) => (
        <RenderSaleItem
          key={i}
          sale={sale}
          chosenSale={chosenSale}
          handleChooseSale={handleChooseSale}
        />
      ))}
    </>
  );
}
