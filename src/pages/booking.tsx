import ImageBackground from '@/components/Imagebackground';
import BookingTabs from '@/components/booking/BookingTabs';
import TESTMODEL from '@/components/booking/Design/Model3D';
import UploadStepperComponent from '@/components/booking/Upload/UploadStepperComponent';
import BookingItem from '@/models/bookingItem';

import {
  alpha,
  Box,
  Button,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useThree } from '@react-three/fiber';
import { useState } from 'react';
const Booking = () => {
  const theme = useTheme();

  const [tabIndex, setTabIndex] = useState(0);
  function handleChangeTab(value: number) {
    setTabIndex(value);
  }

  const [bookingItem, setBookingItem] = useState<BookingItem>({
    id: '',
    images: [],
    occasion: '',
    size: '',
    cake_base_id: '',
    cake_pan: {
      model_3d_id: '',
      position: [],
      rotation: [],
      color: '',
    },
    cake_decor: [],
    message: {
      content: '',
      color: '',
    },
    note: '',
  });
  const handleBookingItemChange = (key: keyof BookingItem, value: any) => {
    setBookingItem({ ...bookingItem, [key]: value });
  };

  //#region Image
  const [imageArray, setImageArray] = useState<File[]>([]);
  function handleImageArrayChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const array = Array.from(e.target.files);
      setImageArray([...imageArray, ...array]);
    }
  }
  function removeImage(index: number) {
    const newImageArray = [...imageArray];
    newImageArray.splice(index, 1);
    setImageArray(newImageArray);
  }
  //#endregion

  // console.log(bookingItem);

  const [screenShot, setScreenShot] = useState<string>('2');
  const [canvas, setCanvas] = useState<any>();

  if (canvas) console.log(canvas.camera.position);

  return (
    <>
      <Box component={'div'}>
        <ImageBackground>
          <Grid
            sx={{ px: 6 }}
            height={'100%'}
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <MuiLink href="#" style={{ textDecoration: 'none' }}>
                <Typography
                  align="center"
                  variant="h2"
                  color={theme.palette.primary.main}
                  sx={{
                    '&:hover': {
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  Đặt bánh
                </Typography>
                <Typography
                  align="center"
                  variant="body2"
                  color={theme.palette.common.white}
                >
                  Đặt bánh từ hình ảnh hoặc tùy chỉnh trang trí theo ý muốn!
                </Typography>
              </MuiLink>
            </Grid>
          </Grid>
        </ImageBackground>

        <Box
          component={'div'}
          sx={{ pt: 0, pb: 16, px: { xs: 2, sm: 2, md: 4, lg: 8 } }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'stretch'}
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sx={{
                mb: 2,
              }}
            >
              <BookingTabs
                tabIndex={tabIndex}
                handleChangeTab={handleChangeTab}
              />
            </Grid>
            {tabIndex === 0 && (
              <Grid item xs={12} lg={10}>
                <UploadStepperComponent
                  bookingItem={bookingItem}
                  buoc1Props={{
                    imageArray: imageArray,
                    handleImageArrayChange: handleImageArrayChange,
                    removeImage: removeImage,
                  }}
                  handleBookingItemChange={handleBookingItemChange}
                />
              </Grid>
            )}

            {tabIndex === 1 && (
              <>
                <Grid item xs={12} lg={3}>
                  <Box
                    component={'div'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: '80vh',
                      backgroundColor: 'grey.200',
                      border: 3,
                      borderRadius: 4,
                      overflow: 'hidden',
                      borderColor: 'secondary.main',
                    }}
                  >
                    <Box
                      component={'img'}
                      src={screenShot}
                      alt={screenShot}
                      sx={{
                        width: '100%',

                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={async () => {
                        if (canvas) {
                          canvas.camera.position.set(0, 0, 2.5);
                        }
                      }}
                    >
                      Nhìn thẳng
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={async () => {
                        if (canvas) {
                          setScreenShot(canvas.gl.domElement.toDataURL());
                        }
                      }}
                    >
                      Bấm
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={true}>
                  <Box
                    component={'div'}
                    sx={{
                      height: '100%',
                      width: '100%',
                      border: 3,
                      borderRadius: 4,
                      overflow: 'hidden',
                      borderColor: 'secondary.main',
                    }}
                  >
                    <TESTMODEL setCanvas={setCanvas} />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Booking;
