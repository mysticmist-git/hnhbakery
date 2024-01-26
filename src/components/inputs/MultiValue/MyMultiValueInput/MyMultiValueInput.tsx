import NewValueChip from '@/components/inputs/MultiValue/NewValueChip';
import { useSnackbarService } from '@/lib/contexts';
import theme from '@/styles/themes/lightTheme';
import { Close } from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';

const MyMultiValueInput = ({
  label,
  values: paramValues,
  onChange,
  readOnly = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  readOnly: boolean;
}) => {
  //#region States

  const [values, setValues] = useState<string[]>(paramValues);
  const [newValue, setNewValue] = useState('');

  //#endregion

  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region useEffects

  useEffect(() => {
    onChange(values);
  }, [onChange, values]);

  //#endregion

  //#region Handlers

  const handleDeleteValue = (value: string) => {
    if (readOnly) {
      handleSnackbarAlert('error', 'Không thể xóa trong chế độ xem');
      return;
    }
    setValues((currentValues) => currentValues.filter((v) => v !== value));
  };

  const handleAddNewValue = () => {
    if (readOnly) {
      handleSnackbarAlert('error', 'Không thể thêm ở chế độ xem');
      return;
    }

    if (!newValue || newValue === '') return;

    setValues((currentValues) => [...currentValues, newValue]);
    setNewValue(() => '');
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
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            deleteIcon={readOnly ? <></> : <Close></Close>}
            onDelete={() => handleDeleteValue(value)}
            sx={{
              color: theme.palette.common.black,
            }}
          />
        ))}

        {!readOnly && (
          <NewValueChip
            value={newValue}
            placeholder="Thêm mới"
            width={'76px'}
            onChange={(e: any) => setNewValue(e.target.value)}
            onClick={handleAddNewValue}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default memo(MyMultiValueInput);
