import { CustomButton, CustomIconButton } from '@/components/buttons';
import { Delete } from '@mui/icons-material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';

function UI_Delete(props: any) {
  const theme = useTheme();
  const { row, onDelete } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      {isMd ? (
        <CustomIconButton
          onClick={() => onDelete(row.id)}
          sx={{
            bgcolor: theme.palette.secondary.main,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: theme.palette.secondary.dark,
              color: theme.palette.common.white,
            },
          }}
        >
          <Delete sx={{ color: theme.palette.common.white }} />
        </CustomIconButton>
      ) : (
        <CustomButton onClick={() => onDelete(row.id)}>
          <Typography
            sx={{ px: 4 }}
            variant="button"
            color={theme.palette.common.white}
          >
            Xóa
          </Typography>
        </CustomButton>
      )}
    </>
  );
}

export default UI_Delete;
