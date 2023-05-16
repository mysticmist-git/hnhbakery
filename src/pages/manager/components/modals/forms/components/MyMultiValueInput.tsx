import { Typography, Chip } from '@mui/material';
import { Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import NewValueChip from './NewValueChip';
import { useSnackbarService } from '@/pages/_app';
import { Close } from '@mui/icons-material';

export default function MyMultiValueInput({
  label,
  values: paramValues,
  onChange,
  readOnly = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  readOnly: boolean;
}) {
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
  }, [values]);

  //#endregion

  //#region Handlers

  const handleDeleteValue = (value: string) => {
    if (readOnly) {
      handleSnackbarAlert('error', 'Không thể xóa trong chế độ xem');
      return;
    }
    setValues(values.filter((v) => v !== value));
  };

  const handleAddNewValue = () => {
    if (readOnly) {
      handleSnackbarAlert('error', 'Không thể thêm ở chế độ xem');
      return;
    }

    if (!newValue || newValue === '') return;

    setValues([...values, newValue]);
    setNewValue('');
  };

  //#endregion

  return (
    <Stack spacing={1}>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            deleteIcon={readOnly ? <></> : <Close></Close>}
            onDelete={() => handleDeleteValue(value)}
          />
        ))}

        {!readOnly && (
          <NewValueChip
            value={newValue}
            placeholder="Thêm mới"
            width={'68px'}
            onChange={(e: any) => setNewValue(e.target.value)}
            onClick={handleAddNewValue}
          />
        )}
      </Stack>
    </Stack>
  );
}
