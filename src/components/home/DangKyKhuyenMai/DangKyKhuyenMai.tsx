import bg10 from '@/assets/Decorate/bg10.png';
import { CustomButton } from '@/components/buttons';
import { CustomTextField } from '@/components/inputs/textFields';
import { Box, Grid, Typography, useTheme } from '@mui/material';

//#region Khuyến mãi
export function DangKyKhuyenMai(props: any) {
  const theme = useTheme();
  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '80vh',
        minHeight: '300px',
        backgroundImage: `url(${bg10.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
        pb={4}
      >
        <Grid item xs={11}>
          <Typography
            align="center"
            color={theme.palette.secondary.main}
            variant="h2"
          >
            Khuyến mãi mỗi ngày
          </Typography>
          <Typography
            variant="body2"
            color={theme.palette.common.black}
            align="center"
          >
            Đăng ký email để nhận ưu đãi và thông tin các chương trình khuyến
            mãi
          </Typography>
        </Grid>
        <Grid item xs={11} sm={8} md={6}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={1}
            width={'100%'}
          >
            <Grid item xs={true}>
              <CustomTextField
                sx={{
                  width: '100%',
                }}
                placeholder="Email của bạn"
                type="email"
                borderColor={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton
                sx={{
                  height: '100%',
                  borderRadius: '8px',
                  py: '12px',
                  px: 3,
                }}
              >
                <Typography variant="button" color={theme.palette.common.white}>
                  Đăng ký
                </Typography>
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
