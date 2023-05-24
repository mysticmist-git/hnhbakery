import { useState, memo, useEffect, useContext, useRef, useMemo } from 'react';
import {
  Grid,
  TextField,
  Autocomplete,
  Stack,
  useTheme,
  Typography,
  Divider,
} from '@mui/material';
import { ProductObject } from '@/lib/models';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ManageContextType, ManageActionType } from '@/lib/localLib/manage';
import CustomTextFieldWithLabel from '@/components/Inputs/CustomTextFieldWithLabel';
import { ManageContext, useSnackbarService } from '@/lib/contexts';
import { MyMultiValuePickerInput } from '@/components/Inputs';
import { getCollection } from '@/lib/firestore/firestoreLib';

const BatchForm = ({ readOnly = false }: { readOnly: boolean }) => {
  //#region Hooks

  const { state, dispatch } = useContext<ManageContextType>(ManageContext);
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  //#endregion

  //#region States

  const [products, setProducts] = useState<ProductObject[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductObject | null>(
    null,
  );

  //#endregion

  // #region Refs

  const materialRef = useRef<string>('');
  const sizeRef = useRef<string>('');

  // #endregion

  // #region useMemos

  const { productMaterials: materials, productSizes: sizes } = useMemo(() => {
    if (!selectedProduct) return { productMaterials: [], productSizes: [] };

    const productMaterials = selectedProduct?.materials ?? [];

    console.log(state.displayingData);

    const productSizes = selectedProduct?.sizes ?? [];

    console.log(state.displayingData);

    if (state.crudModalMode === 'create') {
      dispatch({
        type: ManageActionType.SET_DISPLAYING_DATA,
        payload: {
          ...state.displayingData,
          size: (productSizes[0] as string) ?? '',
          material: (productMaterials[0] as string) ?? '',
        },
      });
    }

    return { productMaterials, productSizes };
  }, [selectedProduct]);

  // #endregion

  //#region useEffects

  useEffect(() => {
    const fetchData = async () => {
      const justGetProducts = await getCollection<ProductObject>('products');

      if (justGetProducts.length === 0) {
        handleSnackbarAlert(
          'error',
          'Không có sản phẩm, vui lòng thêm sản phẩm trước',
        );

        dispatch({
          type: ManageActionType.SET_CRUD_MODAL_MODE,
          payload: false,
        });

        return;
      }

      setProducts(() => [...justGetProducts] ?? []);

      if (['update', 'view'].includes(state.crudModalMode)) {
        const productId = state.displayingData?.product_id;

        if (!productId) return;

        const referencedProduct = justGetProducts.find(
          (product) => product.id === productId,
        );

        if (referencedProduct)
          setSelectedProduct(() => ({ ...referencedProduct }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      !state.displayingData?.product_id ||
      state.displayingData.product_id === ''
    )
      setSelectedProduct(() => null);
  }, [state.displayingData?.product_id]);

  //#endregion

  //#region Functions

  //#endregion

  //#region Methods

  //#endregion

  //#region Console.logs

  //#endregion

  console.log(state.displayingData);

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
                  day.isBefore(
                    dayjs(state.displayingData?.MFG).subtract(1, 'day'),
                  ) ||
                  day.isAfter(dayjs(state.displayingData?.MFG).add(1, 'day'))
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
