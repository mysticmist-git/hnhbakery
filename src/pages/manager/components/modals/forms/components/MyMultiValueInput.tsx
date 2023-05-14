import { Typography, Chip } from '@mui/material';
import { Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import NewValueChip from './NewValueChip';

export default function MyMultiValueInput({
  label,
  values: paramValues,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [values, setValues] = useState<string[]>(paramValues);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    onChange(values);
  }, [values]);

  const handleDeleteValue = (value: string) => {
    setValues(values.filter((v) => v !== value));
  };

  const handleAddNewValue = () => {
    if (!newValue || newValue === '') return;

    setValues([...values, newValue]);
    setNewValue('');
  };

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
            onDelete={() => handleDeleteValue(value)}
          />
        ))}

        <NewValueChip
          value={newValue}
          placeholder="Thêm mới"
          width={'68px'}
          onChange={(e: any) => setNewValue(e.target.value)}
          onClick={handleAddNewValue}
        />
      </Stack>
    </Stack>
  );
}
