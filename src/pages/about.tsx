import CustomButton from '@/components/Inputs/Buttons/customButton';
import CustomCard from '@/components/Layouts/components/CustomCard';
import ImageBackground from '@/components/imageBackground';
import { Box, Grid, Link, Typography, alpha, useTheme } from '@mui/material';
import React, { memo } from 'react';
import HenImage from '../assets/CoFounder/Hen.jpg';
import HuyImage from '../assets/CoFounder/Huy.png';
import cake1 from '../assets/Decorate/cake1.jpg';
import cake3 from '../assets/Decorate/Cake3.png';
import cake4 from '../assets/Decorate/Cake4.png';
import cake5 from '../assets/Decorate/Cake5.png';
import cake6 from '../assets/Decorate/Cake6.png';
import cake7 from '../assets/Decorate/cake7.jpg';
import Image from 'next/image';

const cofounder = [
  {
    image: HenImage.src,
    name: 'Nguyễn Văn Hên',
    description: 'Co-Founder | Thông minh | Tài năng ',
    href: '#',
  },
  {
    image: HuyImage.src,
    name: 'Phan Trường Huy',
    description: 'Co-Founder | Quậy | Phá ',
    href: '#',
  },
];

const contentSanPham = [
  {
    image: cake3.src,
    title: 'Món quà ngọt ngào cho những dịp đặc biệt',
    description:
      'Chúng tôi hiểu rằng những khoảnh khắc đặc biệt yêu thương và kỷ niệm trong cuộc sống của bạn xứng đáng được tôn vinh một cách đặc biệt. Với dịch vụ bán bánh của chúng tôi, bạn sẽ tìm thấy những chiếc bánh tuyệt đẹp và độc đáo, hoàn hảo để làm quà tặng cho người thân yêu của mình.',
  },
  {
    image: cake4.src,
    title: 'Đặt hàng trực tuyến dễ dàng và thuận tiện',
    description:
      'Với trang web của chúng tôi, việc đặt hàng trở nên đơn giản và nhanh chóng. Chỉ cần vài thao tác đơn giản, bạn có thể chọn lựa từ một loạt các mẫu bánh ngọt và gửi yêu cầu đặt hàng trực tuyến. Chúng tôi cam kết đáp ứng sự mong đợi của bạn với chất lượng tốt nhất và dịch vụ chuyên nghiệp.',
  },
  {
    image: cake5.src,
    title: 'Bánh ngọt tinh tế, hương vị độc đáo',
    description:
      'Chúng tôi tự hào mang đến những món bánh với hương vị độc đáo và tinh tế. Mỗi chiếc bánh được tạo ra bởi chàng trai đam mê bánh của chúng tôi đều là một tác phẩm nghệ thuật. Từ cách chọn lựa nguyên liệu tươi ngon cho đến quy trình chế biến tinh tế, chúng tôi cam kết đem đến cho bạn những trải nghiệm ẩm thực đáng nhớ.',
  },
  {
    image: cake6.src,
    title: 'Đội ngũ sáng tạo và chuyên nghiệp',
    description:
      'Với đội ngũ sáng tạo và chuyên nghiệp, chúng tôi luôn đổi mới và thử nghiệm để mang đến những mẫu bánh mới nhất và độc đáo nhất. Bên cạnh đó, chúng tôi luôn lắng nghe ý kiến và đáp ứng nhu cầu của khách hàng. Chúng tôi cam kết mang đến cho bạn không chỉ những chiếc bánh ngọt tuyệt hảo mà còn là trải nghiệm dịch vụ chuyên nghiệp và tận tâm.',
  },
];

const About = () => {
  const theme = useTheme();
  return (
    <>
      <Box>
        <ImageBackground height="100vh" minHeight="600px" image={cake1.src}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
            sx={{ px: 6 }}
          >
            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                spacing={2}
              >
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    variant="h2"
                    color={theme.palette.primary.main}
                  >
                    H&H Bakery
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <Typography
                    align="center"
                    variant="body1"
                    sx={{
                      fontWeight: 'normal',
                    }}
                    color={theme.palette.primary.main}
                  >
                    Chào mừng đến với tiệm bánh đặc biệt của chàng trai đam mê
                    bánh ngọt! Trang web là nơi thăng hoa của hương vị tuyệt vời
                    và sự sáng tạo không ngừng. Với niềm đam mê mãnh liệt và
                    tình yêu với nghệ thuật ẩm thực, chàng trai đã tạo ra một
                    kho báu của những chiếc bánh ngọt tinh tế và độc đáo.
                  </Typography>
                </Grid>

                <Grid item xs={12} textAlign={'center'}>
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <CustomButton
                      sx={{
                        py: 1.5,
                        px: 5,
                        width: 'auto',
                        bgColor: theme.palette.secondary.dark,
                      }}
                    >
                      <Typography
                        variant="button"
                        color={theme.palette.common.white}
                      >
                        Liên hệ ngay!
                      </Typography>
                    </CustomButton>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ImageBackground>

        <Box
          sx={{
            pt: 6,
            pb: 16,
            px: { xs: 2, sm: 2, md: 4, lg: 8 },
          }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'start'}
            spacing={4}
          >
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="h2"
                color={theme.palette.secondary.main}
              >
                H&H Team
              </Typography>
            </Grid>
            {cofounder.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={5} lg={4}>
                <CustomCard
                  imageHeight="276px"
                  descriptionHeight="32px"
                  cardInfo={{
                    image: item.image,
                    name: item.name,
                    description: item.description,
                    href: item.href,
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12} sx={{ mt: 12 }}>
              <Typography
                align="center"
                variant="h2"
                color={theme.palette.secondary.main}
              >
                Sản phẩm
              </Typography>
            </Grid>

            {contentSanPham.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={12 / 2}
                md={12 / 2}
                lg={12 / contentSanPham.length}
                key={index}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{ position: 'relative', width: '100%', height: '84px' }}
                  >
                    <Box
                      component={Image}
                      src={item.image}
                      alt=""
                      fill={true}
                      sx={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    color={theme.palette.common.black}
                    sx={{ my: 2 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'light',
                    }}
                    color={theme.palette.common.black}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}

            <Grid item xs={12} sx={{ mt: 12 }}>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                  height: '284px',
                  backgroundImage: `url(${cake7.src})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.common.black, 0.3),
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    align="center"
                    variant="h2"
                    color={theme.palette.common.white}
                  >
                    H&H Bakery
                  </Typography>
                  <Typography
                    align="center"
                    variant="h3"
                    color={theme.palette.common.white}
                  >
                    035 9723726
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontWeight: 'light',
                      width: { xs: '80%', sm: '60%', md: '40%', lg: '40%' },
                    }}
                    align="center"
                    variant="body1"
                    color={theme.palette.common.white}
                  >
                    Mời bạn một miếng bánh ngon, một tách trà nóng, một ngày an
                    yên.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default memo(About);
