import { useState, useRef, RefObject, useEffect, useContext } from 'react';
import {
  Grid,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Theme,
  Autocomplete,
  Stack,
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import Image, { StaticImageData } from 'next/image';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { ProductObject } from '@/lib/models';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { ManageContextType, ManageActionType } from '@/lib/localLib/manage';
import { ManageContext } from '@/pages/manager/manage';

const BatchForm = ({ readOnly = false }: { readOnly: boolean }) => {
  //#region States

  const [products, setProducts] = useState<ProductObject[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductObject | null>(
    null,
  );

  // Variants
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>('');
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>('');

  //#endregion

  //#region Hooks

  const { state, dispatch } = useContext<ManageContextType>(ManageContext);

  //#endregion

  //#region useEffects

  useEffect(() => {
    const fetchData = async () => {
      const justGetProducts = await getProducts();
      setProducts(justGetProducts ?? []);

      if (['update', 'view'].includes(state.crudModalMode)) {
        const productId = state.displayingData?.product_id;

        if (!productId) return;

        const referencedProduct = justGetProducts.find(
          (product) => product.id === productId,
        );

        if (referencedProduct) setSelectedProduct(referencedProduct);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateVariants = async () => {
      if (!selectedProduct) return;

      setMaterials(selectedProduct.materials);
      setColors(selectedProduct.colors);
      setSizes(selectedProduct.sizes);

      if (['update', 'view'].includes(state.crudModalMode)) {
        // Check state.displayingData
        const displayingData = state.displayingData;

        if (!displayingData) return;

        setSelectedMaterial(selectedProduct.materials[displayingData.material]);
        setSelectedColor(selectedProduct.colors[displayingData.color]);
        setSelectedSize(selectedProduct.sizes[displayingData.size]);
      } else if (state.crudModalMode === 'create') {
        setSelectedMaterial(selectedProduct.materials[0]);
        setSelectedColor(selectedProduct.colors[0]);
        setSelectedSize(selectedProduct.sizes[0]);
      }
    };

    updateVariants();
  }, [selectedProduct]);

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
            renderInput={(params) => <TextField {...params} label="Sản phẩm" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            readOnly={readOnly}
            disablePortal
            value={selectedMaterial}
            onChange={(event, newValue) => {
              if (!newValue) return;

              setSelectedMaterial(newValue);

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  material: materials.indexOf(newValue),
                },
              });
            }}
            options={materials}
            renderInput={(params) => <TextField {...params} label="Vật liệu" />}
          />
          <Autocomplete
            readOnly={readOnly}
            disablePortal
            value={selectedColor}
            onChange={(event, newValue) => {
              if (!newValue) return;

              setSelectedColor(newValue);

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  color: colors.indexOf(newValue),
                },
              });
            }}
            options={colors}
            renderInput={(params) => <TextField {...params} label="Màu sắc" />}
          />
          <Autocomplete
            readOnly={readOnly}
            disablePortal
            value={selectedSize}
            onChange={(event, newValue) => {
              if (!newValue) return;

              setSelectedSize(newValue);

              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  size: sizes.indexOf(newValue),
                },
              });
            }}
            options={sizes}
            renderInput={(params) => <TextField {...params} label="Kích cỡ" />}
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

export default BatchForm;
