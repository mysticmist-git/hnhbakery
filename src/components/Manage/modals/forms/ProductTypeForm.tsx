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
import { ManageContext } from '@/pages/manager/manage';
import { ManageContextType, ManageActionType } from '@/lib/localLib/manage';

const ProductTypeForm = ({
  featuredImageURL,
  handleUploadImageToBrowser,
  readOnly = false,
}: {
  featuredImageURL: string | null;
  handleUploadImageToBrowser: any;
  readOnly: boolean;
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
              onChange={handleUploadImageToBrowser}
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
            error={state.displayingData?.name === ''}
            placeholder="Tên loại sản phẩm"
            variant="standard"
            color="secondary"
            fullWidth
            value={state.displayingData?.name}
            InputProps={{
              readOnly: readOnly,
              sx: { color: theme.palette.common.black },
            }}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main,
                color: theme.palette.common.black,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                color: theme.palette.common.black,
                border: 2,
                borderRadius: '8px',
              },
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
            placeholder="Miêu tả sản phẩm"
            color="secondary"
            multiline
            fullWidth
            InputProps={{
              readOnly: readOnly,
              sx: { color: theme.palette.common.black },
            }}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main,
                color: theme.palette.common.black,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 2,
                borderRadius: '8px',
              },
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
                disabled={readOnly}
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
              <Typography
                sx={{
                  color: state.displayingData?.isActive
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                }}
                variant="body1"
                fontWeight="bold"
              >
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
