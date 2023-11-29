import { CustomTextArea } from '@/components/inputs/TextArea';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

type GhiChuCuaBanProps = {
  note?: string;
  onChange?: (note: string) => void;
};

function GhiChuCuaBan({ note: paramNote, onChange }: GhiChuCuaBanProps) {
  const theme = useTheme();

  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (paramNote !== undefined) {
      setNote(paramNote);
    }
  }, [paramNote]);

  function handleNoteChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNote(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  }

  return (
    <Box
      component={'div'}
      sx={{
        border: 3,
        borderColor: theme.palette.secondary.main,
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bgcolor: theme.palette.common.white,
      }}
    >
      <Box
        component={'div'}
        sx={{
          alignSelf: 'stretch',
          p: 2,

          bgcolor: theme.palette.secondary.main,
        }}
      >
        <Typography
          align="left"
          variant="body1"
          color={theme.palette.common.white}
        >
          Ghi chú
        </Typography>
      </Box>
      <Box
        component={'div'}
        sx={{
          alignSelf: 'stretch',
          justifySelf: 'stretch',
          '&:hover': {
            boxShadow: `0px 0px 5px 2px ${alpha(
              theme.palette.secondary.main,
              0.3
            )}`,
          },
        }}
      >
        <CustomTextArea
          value={note}
          onChange={handleNoteChange}
          minRows={3}
          style={{ minHeight: '40px' }}
          placeholder="Ghi chú cho đầu bếp bên mình"
        />
      </Box>
    </Box>
  );
}

export default GhiChuCuaBan;
