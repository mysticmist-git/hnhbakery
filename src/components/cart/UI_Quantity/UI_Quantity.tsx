import { NumberInputWithButtons } from '@/components/Inputs/MultiValue';
import { useTheme } from '@mui/material';

export default function UI_Quantity(props: any) {
  const theme = useTheme();
  const { row, justifyContent = 'flex-start', onChange } = props;

  return (
    <>
      <NumberInputWithButtons
        min={1}
        value={row.quantity}
        max={row.maxQuantity}
        justifyContent={justifyContent}
        size="small"
        onChange={onChange}
      />
    </>
  );
}
