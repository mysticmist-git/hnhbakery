import { useSnackbarService } from '@/lib/contexts';
import { Close } from '@mui/icons-material';
import { Typography, Chip, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import { useState, useEffect, memo } from 'react';
import { NewValueChip } from '../Manage/modals/forms/components';

const MyMultiValueCheckerPickerInput = ({
  label,
  values: paramValues,
  options,
  onChange,
  readOnly = false,
  mode = 'picker',
}: {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  readOnly?: boolean;
  mode?: 'picker' | 'checker';
}) => {
  //#region States

  const [values, setValues] = useState<string[]>(paramValues);

  // #endregion

  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  //#endregion

  //#region useEffects

  useEffect(() => {
    onChange(values);
  }, [values]);

  //#endregion

  //#region Handlers

  const handleChipClick = (value: string) => {
    if (readOnly) {
      handleSnackbarAlert('error', 'Không thể thay đổi ở chế độ xem');
      return;
    }

    setValues((currentValues) => {
      // Check mode
      if (mode === 'picker') return [value];

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

        {/* {!readOnly && (
          <NewValueChip
            value={newValue}
            placeholder="Thêm mới"
            width={'68px'}
            onChange={(e: any) => setNewValue(e.target.value)}
            onClick={handleAddNewValue}
          />
        )} */}
      </Stack>
    </Stack>
  );
};

export default memo(MyMultiValueCheckerPickerInput);
