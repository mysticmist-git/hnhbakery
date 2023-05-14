import { useContext } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import placeholderImage from '@/assets/placeholder-image.png';
import {
  ManageActionType,
  ManageContextType,
} from '@/pages/manager/lib/manage';
import { ManageContext } from '@/pages/manager/manage';

const ProductTypeForm = ({
  featuredImageURL,
  featuredImageFile,
  handleUploadImage,
}: {
  featuredImageURL: string;
  featuredImageFile: any;
  handleUploadImage: any;
}) => {
  const theme = useTheme();

  const { state, dispatch } = useContext<ManageContextType>(ManageContext);

  return (
    <Grid container>
      <Grid
        item
        xs={6}
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Image
          src={
            featuredImageURL && featuredImageFile !== ''
              ? featuredImageURL
              : placeholderImage
          }
          alt="Featuring Image"
          width={240}
          height={240}
          priority
        />

        <Button
          variant="contained"
          component="label"
          sx={{
            borderRadius: '0 0 0.4rem 0.4rem',
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
            textTransform: 'none',
            width: '100%',
          }}
        >
          Tải ảnh lên
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={handleUploadImage}
          />
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column',
          }}
        >
          <TextField
            label="Tên loại sản phẩm"
            variant="standard"
            color="secondary"
            fullWidth
            value={state.displayingData?.name}
            onChange={(e) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: { ...state.displayingData, name: e.target.value },
              })
            }
          />
          <TextField
            label="Miêu tả"
            color="secondary"
            multiline
            fullWidth
            value={state.displayingData?.description}
            rows={5}
            onChange={(e) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  description: e.target.value,
                },
              })
            }
          />
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={state.displayingData?.isActive}
                onChange={(e) =>
                  dispatch({
                    type: ManageActionType.SET_DISPLAYING_DATA,
                    payload: {
                      ...state.displayingData,
                      isActive: e.target.checked,
                    },
                  })
                }
              />
            }
            label={
              <Typography variant="body1" fontWeight="bold">
                Còn hoạt động
              </Typography>
            }
            labelPlacement="start"
            sx={{
              alignSelf: 'end',
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductTypeForm;
