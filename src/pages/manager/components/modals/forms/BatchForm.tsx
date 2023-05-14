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
import { ManageActionType, ManageContextType } from '../../../lib/manage';
import { ManageContext } from '../../../manage';

const BatchForm = () => {
  // Context state
  const { state, dispatch } = useContext<ManageContextType>(ManageContext);

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

  useEffect(() => {
    const fetchData = async () => {
      const justGetProducts = await getProducts();
      setProducts(justGetProducts ?? []);

      if (state.crudModalMode === 'update') {
        const productId = state.displayingData?.product_id;
        if (!productId) return;

        const referencedProduct = justGetProducts.find(
          (product) => product.id === productId,
        );

        console.log(referencedProduct);

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

      if (state.crudModalMode === 'update') {
        // Check state.displayingData
        const displayingData = state.displayingData;

        if (!displayingData) return;

        setSelectedMaterial(selectedProduct.materials[displayingData.material]);
        setSelectedColor(selectedProduct.colors[displayingData.color]);
        setSelectedSize(selectedProduct.sizes[displayingData.size]);
      }
    };

    updateVariants();
  }, [selectedProduct]);

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

  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={6}>
        <Stack gap={1}>
          <Autocomplete
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
            <TextField
              label="Đã bán"
              variant="standard"
              color="secondary"
              fullWidth
              value={state.displayingData?.soldQuantity ?? -1}
              type="number"
              InputProps={{
                readOnly: true,
              }}
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    totalQuantity: e.target.value,
                  },
                })
              }
            />
            <TextField
              label="Số lượng"
              variant="standard"
              color="secondary"
              type="number"
              fullWidth
              value={state.displayingData?.totalQuantity ?? -1}
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    totalQuantity: e.target.value,
                  },
                })
              }
            />
          </Stack>
          <DatePicker
            label="Ngày sản xuất"
            value={dayjs(state.displayingData?.MFG)}
            onChange={(newValue: any) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: { ...state.displayingData, MFG: newValue.toDate() },
              })
            }
          />
          <DatePicker
            label="Ngày hết hạn"
            value={dayjs(state.displayingData?.EXP)}
            onChange={(newValue: any) =>
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: { ...state.displayingData, EXP: newValue.toDate() },
              })
            }
          />
          {/* <TextField
            label="Ngày sản xuất"
            variant="standard"
            color="secondary"
            fullWidth
            value={displayingData?.MFG}
            onChange={(e) =>
              setDisplayingData({ ...displayingData, MFG: e.target.value })
            }
          />
          <TextField
            label="Ngày hết hạn"
            variant="standard"
            color="secondary"
            fullWidth
            value={displayingData?.EXP}
            onChange={(e) =>
              setDisplayingData({ ...displayingData, EXP: e.target.value })
            }
          /> */}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default BatchForm;
