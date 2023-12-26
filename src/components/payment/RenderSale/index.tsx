import { useTheme } from '@mui/material';
import RenderSaleItem from './RenderSaleItem';
import Sale from '@/models/sale';
export default function RenderSale(props: {
  Sales: Sale[];
  handleChooseSale: (newChosenSale: Sale) => void;
  chosenSale: Sale | null;
}) {
  const theme = useTheme();
  const { Sales, handleChooseSale, chosenSale } = props;

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
