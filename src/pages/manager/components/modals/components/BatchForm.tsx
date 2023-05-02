import { useState, useRef, RefObject, useEffect } from 'react';
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
import { Props as FormProps } from './lib';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { ProductObject } from '@/lib/models';
import { display } from '@mui/system';

interface ProductStateProps {
  id: string;
  name: string;
}

const DEFAULT_PRODUCT_STATE = {
  id: '',
  name: '',
};

const BatchForm: React.FC<FormProps> = ({
  placeholderImage,
  theme,
  displayingData,
  setDisplayingData,
  featuredImageFile,
  setFeaturedImageFile,
  featuredImageURL,
  setFeaturedImageURL,
  uploadInputRef,
  handleUploadImage,
  handleDeleteRow,
  handleModalClose,
}) => {
  const [products, setProducts] = useState<ProductStateProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductStateProps>(
    DEFAULT_PRODUCT_STATE,
  );

  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    async function getProducts() {
      try {
        const collectionRef = collection(db, CollectionName.Products);
        const snapshot = await getDocs(collectionRef);
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            name: docData.name,
          };
        });

        return data;
      } catch (error) {
        console.log('Error fetching product types: ', error);
        return [];
      }
    }

    async function getProduct() {
      if (
        !displayingData ||
        !displayingData.product_id ||
        displayingData.prduct_id === ''
      )
        return;

      try {
        const productRef = doc(
          db,
          CollectionName.Products,
          displayingData.product_id,
        );
        const docSnap = await getDoc(productRef);
        const data = { id: docSnap.id, ...docSnap.data() };

        return data;
      } catch (error) {
        console.log('Error fetching product: ', error);
        return [];
      }
    }

    function getVariants(product: ProductObject) {
      return {
        materials: product.materials,
        colors: product.colors,
        sizes: product.sizes,
      };
    }

    async function fetchData() {
      const products: ProductStateProps[] = await getProducts();
      setProducts(products);

      // set selected product type
      if (displayingData) {
        setSelectedProduct(
          products.find((pt) => pt.id === displayingData.product_id) ??
            products[0],
        );
      }

      const referencedProduct = await getProduct();

      // If there's no product then stop (in case of create-mode of something else)
      if (!referencedProduct) return;

      const { materials, colors, sizes } = getVariants(
        referencedProduct as ProductObject,
      );

      setMaterials(materials);
      setColors(colors);
      setSizes(sizes);

      setSelectedMaterial(materials[displayingData.material] ?? '');
      setSelectedColor(colors[displayingData.color] ?? '');
      setSelectedSize(sizes[displayingData.size] ?? '');
    }

    fetchData();
  }, []);
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

              setDisplayingData({
                ...displayingData,
                product_id: newValue?.id,
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

              setDisplayingData({
                ...displayingData,
                material: materials.indexOf(newValue),
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

              setDisplayingData({
                ...displayingData,
                color: colors.indexOf(newValue),
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

              setDisplayingData({
                ...displayingData,
                size: sizes.indexOf(newValue),
              });
            }}
            options={sizes}
            renderInput={(params) => <TextField {...params} label="Kích cỡ" />}
          />
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack gap={1}>
          <TextField
            label="Số lượng"
            variant="standard"
            color="secondary"
            fullWidth
            value={displayingData?.totalQuantity}
            onChange={(e) =>
              setDisplayingData({
                ...displayingData,
                totalQuantity: e.target.value,
              })
            }
          />
          <TextField
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
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default BatchForm;
