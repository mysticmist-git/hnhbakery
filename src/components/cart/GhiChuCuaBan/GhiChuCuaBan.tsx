import CustomTextarea from '@/components/Inputs/TextArea/CustomTextArea';
import { Box, Typography, alpha, useTheme } from '@mui/material';

type GhiChuCuaBanProps = {
  note: string;
  onChange: (note: string) => void;
};

function GhiChuCuaBan({ note, onChange }: GhiChuCuaBanProps) {
  const theme = useTheme();

  return (
    <Box
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
        <CustomTextarea
          value={note}
          onChange={(e) => onChange(e.target.value)}
          minRows={3}
          style={{ minHeight: '40px' }}
          placeholder="Ghi chú cho đầu bếp bên mình"
        />
      </Box>
    </Box>
  );
}

export default GhiChuCuaBan;
