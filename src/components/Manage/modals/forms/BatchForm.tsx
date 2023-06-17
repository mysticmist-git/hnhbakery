import { MyMultiValuePickerInput } from '@/components/Inputs';
import CustomTextFieldWithLabel from '@/components/Inputs/CustomTextFieldWithLabel';
import { ModalBatchObject, ModalFormProps } from '@/lib/localLib/manage';
import {
  Autocomplete,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { memo } from 'react';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatchObject | null;
}

const BatchForm = ({ data }: BatchFormProps) => {
  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={6}>
        <Stack gap={2}>
          <Autocomplete
            readOnly={readOnly}
            disablePortal
            value={selectedProduct}
            onChange={(event, newValue) => {
              if (!newValue) return;

              setSelectedProduct(() => newValue);

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  product_id: newValue?.id,
                },
              });
            }}
            options={products}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <CustomTextFieldWithLabel {...params} label="Sản phẩm" />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          <MyMultiValuePickerInput
            label="Vật liệu"
            value={state.displayingData?.material ?? ''}
            readOnly={readOnly}
            ref={materialRef}
            options={materials}
            onChange={(value) => {
              if (!value) return;

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  material: value,
                },
              });
            }}
          />

          <MyMultiValuePickerInput
            label="Kích cỡ"
            value={state.displayingData?.size ?? ''}
            readOnly={readOnly}
            options={sizes}
            ref={sizeRef}
            onChange={(value) => {
              if (!value) return;

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  size: value,
                },
              });
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack gap={2}>
          <DateTimePicker
            readOnly={readOnly}
            label="Ngày sản xuất"
            value={dayjs(state.displayingData?.MFG)}
            shouldDisableDate={(day) => {
              // Disable day before today
              return dayjs(state.displayingData?.MFG)
                .subtract(1, 'day')
                .isAfter(day);
            }}
            format="DD/MM/YYYY | HH:mm"
            onChange={(newValue) => {
              if (!newValue) return;

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  MFG: newValue.toDate(),
                },
              });
            }}
          />

          <DateTimePicker
            readOnly={readOnly}
            label="Ngày hết hạn"
            value={dayjs(state.displayingData?.EXP)}
            shouldDisableDate={(day) => {
              // Disable day before today
              return (
                day.isBefore(dayjs(state.displayingData?.MFG)) ||
                day.isSame(dayjs(state.displayingData?.MFG))
              );
            }}
            format="DD/MM/YYYY | HH:mm"
            onChange={(newValue) => {
              if (!newValue) return;

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  EXP: newValue.toDate(),
                },
              });
            }}
          />

          <TextField
            label="Giá"
            variant="standard"
            color="secondary"
            type="number"
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
            value={state.displayingData?.price}
            onChange={(e) => {
              if (isNaN(parseInt(e.target.value))) {
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    price: 0,
                  },
                });
                return;
              }

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  price: parseInt(e.target.value),
                },
              });
            }}
          />

          <Stack gap={1} direction="row">
            {['update', 'view'].includes(state.crudModalMode) && (
              <TextField
                label="Đã bán"
                variant="standard"
                color="secondary"
                fullWidth
                value={state.displayingData?.soldQuantity ?? -1}
                type="number"
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
                error={
                  state.displayingData?.soldQuantity >
                  state.displayingData?.totalQuantity
                }
                onChange={(e) => {
                  if (isNaN(parseInt(e.target.value))) {
                    dispatch({
                      type: ManageActionType.SET_DISPLAYING_DATA,
                      payload: {
                        ...state.displayingData,
                        soldQuantity: 0,
                      },
                    });
                    return;
                  }

                  dispatch({
                    type: ManageActionType.SET_DISPLAYING_DATA,
                    payload: {
                      ...state.displayingData,
                      soldQuantity: parseInt(e.target.value),
                    },
                  });
                }}
              />
            )}

            <TextField
              label="Số lượng"
              variant="standard"
              color="secondary"
              type="number"
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
              value={state.displayingData?.totalQuantity ?? -1}
              onChange={(e) => {
                if (isNaN(parseInt(e.target.value))) {
                  dispatch({
                    type: ManageActionType.SET_DISPLAYING_DATA,
                    payload: {
                      ...state.displayingData,
                      totalQuantity: 0,
                    },
                  });
                  return;
                }

                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    totalQuantity: parseInt(e.target.value),
                  },
                });
              }}
            />
          </Stack>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Divider
          sx={{
            my: 1,
            mt: 3,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={2}>
          <Typography>Discount</Typography>
          <Stack direction="row" justifyContent={'space-between'} spacing={2}>
            <DateTimePicker
              label="Thời gian bắt đầu"
              readOnly={readOnly}
              value={dayjs(state.displayingData?.discountDate)}
              shouldDisableDate={(day) => {
                // Disable day before today
                return (
                  day.isBefore(dayjs(state.displayingData?.MFG)) ||
                  day.isAfter(dayjs(state.displayingData?.EXP))
                );
              }}
              format="DD/MM/YYYY | HH:mm"
              onChange={(date) => {
                if (!date) return;

                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    discountDate: date.toDate(),
                  },
                });
              }}
              sx={{
                width: '100%',
              }}
            />

            <TextField
              label="Tỉ lệ giảm giá"
              variant="standard"
              color="secondary"
              type="number"
              fullWidth
              value={state.displayingData?.discountPercent}
              onChange={(e) => {
                if (
                  parseInt(e.target.value) < 0 ||
                  parseInt(e.target.value) > 100
                ) {
                  return;
                }

                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    discountPercent: parseInt(e.target.value),
                  },
                });
              }}
              InputProps={{
                readOnly: readOnly,
                endAdornment: '%',
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
            />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default memo(BatchForm);
