import { Box, Typography, useTheme } from '@mui/material';

// #endregion
export default function CaiKhungCoTitle(props: any) {
  const { title = 'Title đâu?', children, fluidContent = false } = props;

  const theme = useTheme();
  return (
    <>
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
            py: 1,
            bgcolor: theme.palette.secondary.main,
          }}
        >
          <Typography
            align="left"
            variant="body1"
            color={theme.palette.common.white}
          >
            {title}
          </Typography>
        </Box>
        <Box
          component={'div'}
          sx={{
            alignSelf: 'stretch',
            justifySelf: 'stretch',
            p: fluidContent ? 0 : 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
