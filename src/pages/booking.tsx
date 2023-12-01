import ImageBackground from '@/components/Imagebackground';
import BookingTabs from '@/components/booking/BookingTabs';
import ActionButton from '@/components/booking/Design/ActionButton';
import CustomText3D from '@/components/booking/Design/CustomText3D';
import EditModel from '@/components/booking/Design/EditModel';
import Canvas3D, { ActiveDrag } from '@/components/booking/Design/Model3D';
import ScreenShotLoading from '@/components/booking/Design/ScreenShotLoading';
import {
  createModel3DItem,
  dataURLtoFile,
} from '@/components/booking/Design/Utils';
import UploadStepperComponent from '@/components/booking/Upload/UploadStepperComponent';
import { getCakeTextures } from '@/lib/DAO/cakeTextureDAO';
import { getAllModel3d } from '@/lib/DAO/model3dDAO';
import { useSnackbarService } from '@/lib/contexts';
import { PaymentContext } from '@/lib/contexts/paymentContext';
import BookingItem from '@/models/bookingItem';
import CakeTexture from '@/models/cakeTexture';
import Model3d from '@/models/model3d';

import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { RootState, useThree } from '@react-three/fiber';
import path from 'path';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  path?: string;
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
  isText?: boolean;
};

export type Model3DContextType = {
  array: Model3DProps[];
  editIndex: number;
  handleChangeContext?: (type: string, value: any, index?: number) => void;
  textureData?: CakeTexture[];
  withRoomDesign: boolean;
  reloadCanvas: () => void;
};

export const Model3DContext = createContext<Model3DContextType>({
  array: [],
  editIndex: -1,
  handleChangeContext: () => {},
  textureData: [],
  withRoomDesign: false,
  reloadCanvas: () => {},
});

const Booking = () => {
  const theme = useTheme();

  const handleSnackbarAlert = useSnackbarService();

  const [tabIndex, setTabIndex] = useState(0);
  function handleChangeTab(value: number) {
    setTabIndex(value);
  }

  const {
    bookingItem,
    imageArray,
    handleBookingItemChange,
    handleImageArrayChange,
    addImageArrayFromModel3D,
    removeImage,
  } = useContext(PaymentContext);

  //#region screenshot
  const [canvas, setCanvas] = useState<RootState>();
  const [keyCanvas, setKeyCanvas] = useState(0);
  const [withRoomDesign, setWithRoomDesign] = useState<boolean>(true);
  const [isPicturing, setIsPicturing] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  //#endregion

  //#region 3D

  const [arrayModel, setArrayModel] = useState<Model3DProps[]>([]);

  const [editIndex, setEditIndex] = useState(-1);

  const handleChangeContext = useCallback(
    (type: string, value: any, index?: number) => {
      if (type === 'array') {
        if (
          index !== undefined &&
          value.children.length > 0 &&
          value.textures.length > 0
        ) {
          if (index == 0) {
            setArrayModel((prev) => {
              const newArray = [...prev].map((item) => {
                return {
                  ...item,
                  ghim: 0,
                  scale: 1,
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
          setEditIndex(-1);
          handleSnackbarAlert('success', 'Xóa mô hình thành công!');
        }
      } else if (type === 'add') {
        setArrayModel((prev) => [...prev, createModel3DItem(value)]);
        handleSnackbarAlert('success', 'Thêm mô hình thành công!');
      } else if (type === 'editIndex') {
        setEditIndex(value);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const newArray = [];
        newArray.push(
          createModel3DItem({
            // path: models.filter((item) => item.model_3d_type_id == '1')[2].file,
            path: '/cake-002.obj',
          }),
          createModel3DItem({
            isText: true,
            planeId: { id: 2 },
            children: ['Trăm năm hạnh phúc'],
          })
          // createModel3DItem({
          //   // path: models.filter((item) => item.model_3d_type_id == '1')[2].file,
          //   path: '/cake-pop-with-tag-001.obj',
          //   planeId: { id: 2 },
          // })
        );
        return newArray;
      });
    }
    fetchData();
  }, []);

  //#endregion

  useEffect(() => {
    if (!withRoomDesign && isPicturing && canvas) {
      const pictureTimeDelay = 500; //mili

      let zoomConfig = 2.5;
      if (arrayModel.length > 0) {
        let maxX = 0;
        let maxY = 0;
        let maxZ = 0;

        for (let i = 0; i < 1; i++) {
          const box3 = arrayModel[i].box3;
          if (box3) {
            if (box3.max.x > maxX) maxX = box3.max.x;
            if (box3.max.y > maxY) maxY = box3.max.y;
            if (box3.max.z > maxZ) maxZ = box3.max.z;
          }
        }

        zoomConfig = Math.max(maxX, maxY, maxZ) * 10;
      }
      const newFileArray: File[] = [];

      for (let i = 0; i <= 8; i++) {
        if (i % 2 == 0) {
          if (i == 8) {
            setTimeout(() => {
              if (newFileArray.length == 4) {
                addImageArrayFromModel3D(newFileArray);
              }
              setWithRoomDesign(true);
              canvas.camera.position.set(0, zoomConfig, zoomConfig);
              setProgress(Math.round((i * 100) / 8));
              setIsPicturing(false);
              setTabIndex(0);
              handleSnackbarAlert(
                'success',
                'Chụp ảnh mô hình thành công! Vui lòng thực hiện các bước tiếp theo.'
              );
            }, pictureTimeDelay * i);
          } else
            setTimeout(() => {
              if (i == 0) canvas.camera.position.set(0, zoomConfig, zoomConfig);
              else if (i == 2)
                canvas.camera.position.set(zoomConfig, zoomConfig, 0);
              else if (i == 4)
                canvas.camera.position.set(0, zoomConfig, -1 * zoomConfig);
              else if (i == 6)
                canvas.camera.position.set(-1 * zoomConfig, zoomConfig, 0);
              setProgress(Math.round((i * 100) / 8));
            }, pictureTimeDelay * i);
        } else {
          setTimeout(() => {
            const newFile = dataURLtoFile(
              canvas.gl.domElement.toDataURL(),
              `${(i + 1) / 2}.png`
            );
            if (newFile) {
              newFileArray.push(newFile);
            }
            setProgress(Math.round((i * 100) / 8));
          }, pictureTimeDelay * i);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withRoomDesign, isPicturing]);

  const checkInfor = useCallback(
    (buoc: number) => {
      console.log(bookingItem);

      if (buoc == 1) {
        if (imageArray.length == 0) {
          alert('Vui lòng chọn ảnh!');
          return false;
        }
      } else if (buoc == 2) {
        if (!bookingItem.occasion || bookingItem.occasion == '') {
          alert('Vui lòng chọn dịp!');
          return false;
        }

        if (!bookingItem.size || bookingItem.size == '') {
          alert('Vui lòng chọn size!');
          return false;
        }

        if (!bookingItem.cake_base_id || bookingItem.cake_base_id == '') {
          alert('Vui lòng chọn cốt bánh!');
          return false;
        }

        if (
          bookingItem.message.content == '' ||
          bookingItem.message.color == ''
        ) {
          alert('Vui lòng điền thông điệp!');

          return false;
        }
      }

      return true;
    },
    [imageArray, bookingItem]
  );

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
                checkInfor={checkInfor}
              />
            </Grid>

            <Model3DContext.Provider
              value={{
                array: arrayModel,
                editIndex: editIndex,
                handleChangeContext: handleChangeContext,
                textureData: textureData,
                withRoomDesign: withRoomDesign,
                reloadCanvas: () => {
                  setKeyCanvas((prev) => prev + 1);
                },
              }}
            >
              <Grid
                item
                xs={12}
                lg={9}
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
                  <Canvas3D setCanvas={setCanvas} keyCanvas={keyCanvas} />
                  <ActionButton
                    khuonBanhArray={khuonBanhArray}
                    trangTriArray={trangTriArray}
                  />
                  {isPicturing && <ScreenShotLoading progress={progress} />}
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

              <Grid item xs={12} display={tabIndex === 1 ? 'block' : 'none'}>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      px: 4,
                    }}
                    disabled={isPicturing}
                    onClick={() => {
                      setWithRoomDesign(false);
                      setIsPicturing(true);
                    }}
                  >
                    Tiếp theo
                  </Button>
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
