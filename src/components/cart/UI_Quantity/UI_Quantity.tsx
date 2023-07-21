import { NumberInputWithButtons } from '@/components/inputs/MultiValue';
import { useTheme } from '@mui/material';

export default function UI_Quantity({
  value,
  max,
  min,
  onChange,
  justifyContent = 'flex-start',
}: {
  min: number;
  max: number;
  value?: number;
  onChange?: (value: number) => void;
  justifyContent: any;
}) {
  return (
    <>
      <NumberInputWithButtons
        value={value}
        min={min}
        max={max}
        justifyContent={justifyContent}
        size="small"
        onChange={onChange}
      />
    </>
  );
}
