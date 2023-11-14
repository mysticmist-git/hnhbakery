import ImageBackground from '@/components/Imagebackground';
import BookingTabs from '@/components/booking/BookingTabs';
import EditModel from '@/components/booking/Design/EditModel';
import Canvas3D, { ActiveDrag } from '@/components/booking/Design/Model3D';
import { createModel3DItem } from '@/components/booking/Design/Utils';
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
import { RootState, useThree } from '@react-three/fiber';
import path from 'path';
import { createContext, useEffect, useState } from 'react';
import { Group, Object3DEventMap, Vector3 } from 'three';

export type Model3DPropsType =
  | 'path'
  | 'children'
  | 'textures'
  | 'scale'
  | 'planeId'
  | 'rotation'
  | 'box3';

export type Model3DProps = {
  path: string;
  children?: string[];
  textures?: { name: string; path: string }[];
  scale?: number;
  planeId?: ActiveDrag;
  rotation?: [number, number, number];
  box3?: {
    min: Vector3;
    max: Vector3;
  };
};

export type Model3DContextType = {
  array: Model3DProps[];
  editIndex: number;
  handleChangeContext?: (type: string, value: any, index?: number) => void;
};

export const Model3DContext = createContext<Model3DContextType>({
  array: [],
  editIndex: -1,
  handleChangeContext: () => {},
});

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

  //#region screenshot
  const [screenShot, setScreenShot] = useState<string>('2');
  const [canvas, setCanvas] = useState<RootState>();
  //#endregion

  //#region 3D

  const [model3DContext, setArrayModel3D] = useState<Model3DContextType>({
    array: [
      createModel3DItem({
        path: 'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/model3D%2Fcake-002.obj?alt=media&token=d64a0d8e-459d-4cda-a140-ebeb4802a411',
        textures: [
          {
            name: 'Dâu',
            path: 'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/cakeTextures%2Fstrawberry.png?alt=media&token=4595f126-25a7-4a9c-a6de-a5b55b67593f',
          },
        ],
      }),
      createModel3DItem({
        path: '/freepik/cupcake-topper.obj',
        textures: [
          {
            name: 'Dâu',
            path: 'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/cakeTextures%2Fstrawberry.png?alt=media&token=4595f126-25a7-4a9c-a6de-a5b55b67593f',
          },
          {
            name: 'Vani',
            path: 'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/cakeTextures%2Fvani.png?alt=media&token=12ff1884-9366-4113-b8cb-a19af6607808',
          },
        ],
        scale: 0.7,
        planeId: { id: 2 },
      }),
    ],
    editIndex: 0,
  });

  function handleChangeContext(type: string, value: any, index?: number) {
    if (type === 'array') {
      if (index !== undefined) {
        setArrayModel3D((prev) => {
          const newArray = [...prev.array];
          newArray[index] = value;

          return {
            ...prev,
            array: newArray,
          };
        });
      }
    } else if (type === 'editIndex') {
      setArrayModel3D({ ...model3DContext, [type]: value });
    }
  }

  //#endregion

  console.log(model3DContext.array);

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
                <Model3DContext.Provider
                  value={{
                    ...model3DContext,
                    handleChangeContext: handleChangeContext,
                  }}
                >
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
                  <Grid item xs={12} lg={6}>
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
                      <Canvas3D setCanvas={setCanvas} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <Box
                      component={'div'}
                      sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: '80vh',
                        backgroundColor: 'white',
                        border: 3,
                        borderRadius: 4,
                        overflow: 'hidden',
                        borderColor: 'secondary.main',
                      }}
                    >
                      <EditModel />
                    </Box>
                  </Grid>
                </Model3DContext.Provider>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Booking;
