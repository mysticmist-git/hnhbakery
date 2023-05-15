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
  handleUploadImage,
}: {
  featuredImageURL: string | null;
  handleUploadImage: any;
}) => {
  //#region States

  //#endregion

  //#region Hooks

  const { state, dispatch } = useContext<ManageContextType>(ManageContext);
  const theme = useTheme();

  //#endregion

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
            featuredImageURL && featuredImageURL.length > 0
              ? featuredImageURL
              : placeholderImage
          }
          alt="Featuring Image"
          width={240}
          height={240}
          priority
          style={{
            borderRadius: '0.4rem',
          }}
        />

        {['update', 'create'].includes(state.crudModalMode) && (
          <Button
            variant="contained"
            component="label"
            sx={{
              mt: 1,
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
              textTransform: 'none',
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
        )}
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
            InputProps={{
              readOnly: state.crudModalMode === 'view',
            }}
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
            InputProps={{
              readOnly: state.crudModalMode === 'view',
            }}
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
                disabled={state.crudModalMode === 'view'}
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
                {state.displayingData?.isActive
                  ? 'Còn hoạt động'
                  : 'Ngưng hoạt động'}
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
