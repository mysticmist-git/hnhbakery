import { useState, memo, useEffect, useContext, useRef, useMemo } from 'react';
import { Grid, TextField, Autocomplete, Stack, useTheme } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { ProductObject } from '@/lib/models';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ManageContextType, ManageActionType } from '@/lib/localLib/manage';
import CustomTextFieldWithLabel from '@/components/Inputs/CustomTextFieldWithLabel';
import { ManageContext, useSnackbarService } from '@/lib/contexts';
import {
  MyMultiValueCheckerInput,
  MyMultiValuePickerInput,
} from '@/components/Inputs';

const BatchForm = ({ readOnly = false }: { readOnly: boolean }) => {
  //#region States

  const [products, setProducts] = useState<ProductObject[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductObject | null>(
    null,
  );

  //#endregion

  // region Refs

  const materialRef = useRef<string>('');
  const colorRef = useRef<string>('');
  const sizeRef = useRef<string>('');

  // #endregion

  // #region useMemos

  const materials = useMemo(() => {
    return selectedProduct?.materials ?? [];
  }, [selectedProduct]);

  const colors = useMemo(() => {
    return selectedProduct?.colors ?? [];
  }, [selectedProduct]);

  const sizes = useMemo(() => {
    return selectedProduct?.sizes ?? [];
  }, [selectedProduct]);

  // #endregion

  //#region Hooks

  const { state, dispatch } = useContext<ManageContextType>(ManageContext);
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  //#endregion

  //#region useEffects

  useEffect(() => {
    const fetchData = async () => {
      const justGetProducts = await getProducts();

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

      setProducts(() => justGetProducts ?? []);

      if (['update', 'view'].includes(state.crudModalMode)) {
        const productId = state.displayingData?.product_id;

        if (!productId) return;

        const referencedProduct = justGetProducts.find(
          (product) => product.id === productId,
        );

        if (referencedProduct) setSelectedProduct(() => referencedProduct);
      }
    };

    fetchData();
  }, []);

  //#endregion

  //#region Functions

  //#endregion

  //#region Methods

  async function getProducts(): Promise<ProductObject[]> {
    try {
      const collectionRef = collection(db, CollectionName.Products);
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
        };
      });

      return data as ProductObject[];
    } catch (error) {
      console.log('Error fetching product types: ', error);
      return [];
    }
  }

  //#endregion

  //#region Console.logs

  console.log(state.displayingData);

  //#endregion

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

              setSelectedProduct(newValue);

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
            label="Màu sắc"
            value={state.displayingData?.color ?? ''}
            readOnly={readOnly}
            options={colors}
            ref={colorRef}
            onChange={(value) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  color: value,
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
                onChange={(e) =>
                  dispatch({
                    type: ManageActionType.SET_DISPLAYING_DATA,
                    payload: {
                      ...state.displayingData,
                      soldQuantity: parseInt(e.target.value),
                    },
                  })
                }
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
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    totalQuantity: parseInt(e.target.value),
                  },
                })
              }
            />
          </Stack>
          <DatePicker
            readOnly={readOnly}
            label="Ngày sản xuất"
            value={dayjs(state.displayingData?.MFG)}
            disablePast={state.crudModalMode === 'create'}
            format="DD/MM/YYYY"
            onChange={(newValue: any) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: { ...state.displayingData, MFG: newValue.toDate() },
              })
            }
          />
          <DatePicker
            readOnly={readOnly}
            label="Ngày hết hạn"
            value={dayjs(state.displayingData?.EXP)}
            disablePast={state.crudModalMode === 'create'}
            shouldDisableDate={(day) => {
              return dayjs(state.displayingData?.MFG).isAfter(day);
            }}
            format="DD/MM/YYYY"
            onChange={(newValue: any) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: { ...state.displayingData, EXP: newValue.toDate() },
              })
            }
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
            value={state.displayingData?.price ?? 0}
            onChange={(e) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  price: parseInt(e.target.value),
                },
              })
            }
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default memo(BatchForm);
