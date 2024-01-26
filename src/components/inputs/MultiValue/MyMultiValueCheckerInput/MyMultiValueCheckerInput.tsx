import { useSnackbarService } from '@/lib/contexts';
import { Chip, Stack, Typography, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';

const MyMultiValueCheckerPickerInput = ({
  label,
  values: paramValues,
  options,
  onChange,
  readOnly = false,
}: {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  readOnly?: boolean;
}) => {
  //#region States

  const [values, setValues] = useState<string[]>(paramValues ?? []);

  // #endregion

  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  //#endregion

  //#region useEffects

  useEffect(() => {
    onChange(values);
  }, [onChange, values]);

  //#endregion

  //#region Handlers

  const handleChipClick = (value: string) => {
    if (readOnly) {
      handleSnackbarAlert('error', 'Không thể thay đổi ở chế độ xem');
      return;
    }

    setValues((currentValues) => {
      // Checker
      if (currentValues.includes(value)) {
        return currentValues.filter((v) => v !== value);
      } else {
        return [...currentValues, value];
      }
    });
  };

  //#endregion

  return (
    <Stack spacing={1}>
      <Typography
        sx={{ color: theme.palette.common.black }}
        variant="body1"
        fontWeight="bold"
      >
        {label}
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {options.map((value) => (
          <Chip
            key={value}
            label={value}
            sx={{
              color: theme.palette.common.black,
              border: values.includes(value)
                ? `1px solid ${theme.palette.secondary.main}`
                : '',
            }}
            onClick={() => handleChipClick(value)}
          />
        ))}
        {options.length === 0 && (
          <Typography variant="body2">Không có lựa chọn</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(MyMultiValueCheckerPickerInput);
