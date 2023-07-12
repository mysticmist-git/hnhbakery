import { NumberInputWithButtons } from '@/components/Inputs/MultiValue';
import { useTheme } from '@mui/material';

export default function UI_Quantity({
  value,
  max,
  min,
  onChange,
  justifyContent = 'flex-start',
}: {
  value: number;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  justifyContent: any;
}) {
  const theme = useTheme();

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
