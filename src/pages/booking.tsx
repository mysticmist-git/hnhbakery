import ImageBackground from '@/components/Imagebackground';
import BookingTabs from '@/components/booking/BookingTabs';
import ActionButton from '@/components/booking/Design/ActionButton';
import EditModel from '@/components/booking/Design/EditModel';
import Canvas3D, { ActiveDrag } from '@/components/booking/Design/Model3D';
import { createModel3DItem } from '@/components/booking/Design/Utils';
import UploadStepperComponent from '@/components/booking/Upload/UploadStepperComponent';
import { getCakeTextures } from '@/lib/DAO/cakeTextureDAO';
import { getAllModel3d } from '@/lib/DAO/model3dDAO';
import BookingItem from '@/models/bookingItem';
import CakeTexture from '@/models/cakeTexture';
import Model3d from '@/models/model3d';

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
import { createContext, useCallback, useEffect, useState } from 'react';
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
  ghim?: number;
  planeId?: ActiveDrag;
  rotation?: [number, number, number];
  box3?: {
    min: Vector3;
    max: Vector3;
  };
  isShow?: boolean;
};

export type Model3DContextType = {
  array: Model3DProps[];
  editIndex: number;
  handleChangeContext?: (type: string, value: any, index?: number) => void;
  textureData?: CakeTexture[];
};

export const Model3DContext = createContext<Model3DContextType>({
  array: [],
  editIndex: -1,
  handleChangeContext: () => {},
  textureData: [],
});

const Booking = () => {
  const theme = useTheme();

  const [tabIndex, setTabIndex] = useState(1);
  function handleChangeTab(value: number) {
    setTabIndex(value);
  }

  const [bookingItem, setBookingItem] = useState<BookingItem>({
    id: '',
    images: [],
    occasion: '',
    size: '',
    cake_base_id: '',
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

  const [arrayModel, setArrayModel] = useState<Model3DProps[]>([]);

  const [editIndex, setEditIndex] = useState(-1);

  const handleChangeContext = useCallback(
    (type: string, value: any, index?: number) => {
      if (type === 'array') {
        if (index !== undefined && value.children.length > 0) {
          if (index == 0) {
            setArrayModel((prev) => {
              const newArray = [...prev].map((item) => {
                return {
                  ...item,
                  scale: 0.2,
                };
              });
              newArray[index] = value;
              return newArray;
            });
          } else {
            setArrayModel((prev) => {
              const newArray = [...prev];
              newArray[index] = value;
              return newArray;
            });
          }
        }
      } else if (type == 'delete') {
        if (index !== undefined && index > 0) {
          setArrayModel((prev) => {
            const newArray = [...prev];
            newArray[index] = {
              ...newArray[index],
              isShow: false,
            };
            return newArray;
          });
        }
      } else if (type === 'add') {
        setArrayModel((prev) => [...prev, createModel3DItem(value)]);
      } else if (type === 'editIndex') {
        setEditIndex(value);
      }
    },
    []
  );

  const [textureData, setTextureData] = useState<CakeTexture[]>([]);
  const [khuonBanhArray, setKhuonBanhArray] = useState<Model3d[]>([]);
  const [trangTriArray, setTrangTriArray] = useState<Model3d[]>([]);
  useEffect(() => {
    async function fetchData() {
      setTextureData(await getCakeTextures());

      const models = await getAllModel3d();
      setKhuonBanhArray(models.filter((item) => item.model_3d_type_id == '1'));
      setTrangTriArray(models.filter((item) => item.model_3d_type_id == '2'));

      setArrayModel((prev) => {
        const newArray = [...prev];
        newArray[0] = createModel3DItem({
          // path: models.filter((item) => item.model_3d_type_id == '1')[2].file,
          path: '/cake-002.obj',
        });
        return newArray;
      });
    }
    fetchData();
  }, []);

  //#endregion

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

            <Grid
              item
              xs={12}
              lg={10}
              display={tabIndex === 0 ? 'block' : 'none'}
            >
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

            <Model3DContext.Provider
              value={{
                array: arrayModel,
                editIndex: editIndex,
                handleChangeContext: handleChangeContext,
                textureData: textureData,
              }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                display={tabIndex === 1 ? 'block' : 'none'}
              >
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    height: '80vh',
                    minHeight: '500px',
                    backgroundColor: 'grey.200',
                    border: 3,
                    borderRadius: 4,
                    overflow: 'hidden',
                    borderColor: 'secondary.main',
                  }}
                >
                  {/* <Box
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
                      </Button> */}

                  <Box
                    component={'div'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textAlign: 'center', color: 'grey.500' }}
                    >
                      Not Implemented
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                lg={6}
                display={tabIndex === 1 ? 'block' : 'none'}
              >
                <Box
                  component={'div'}
                  sx={{
                    height: '80vh',
                    minHeight: '500px',
                    width: '100%',
                    border: 3,
                    borderRadius: 4,
                    overflow: 'hidden',
                    borderColor: 'secondary.main',
                    position: 'relative',
                  }}
                >
                  <Canvas3D setCanvas={setCanvas} />
                  <ActionButton
                    khuonBanhArray={khuonBanhArray}
                    trangTriArray={trangTriArray}
                  />
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                lg={3}
                display={tabIndex === 1 ? 'block' : 'none'}
              >
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    height: '80vh',
                    minHeight: '500px',
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
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Booking;