import { ManageContext } from '@/lib/contexts';
import { getDocFromFirestore } from '@/lib/firestore/firestoreLib';
import { ManageContextType } from '@/lib/localLib/manage';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import BaseObject from '@/lib/models/BaseObject';
import { BatchObject } from '@/lib/models/Batch';
import theme from '@/styles/themes/lightTheme';
import formatCurrency from '@/utilities/formatCurrency';
import { TableCell, TableRow, Typography } from '@mui/material';
import { memo, useContext, useEffect, useState } from 'react';
import RowActionButtons from './RowActionButtons';

interface AssemblyBatchObject extends BatchObject {
  productName: string;
  productIsActive: boolean;
  productTypeIsActive: boolean;
}

const GeneratedBatchTableBody = () => {
  const [displayMainDocs, setDisplayMainDocs] = useState<
    AssemblyBatchObject[] | null
  >([]);

  //#region Hooks

  const { state } = useContext<ManageContextType>(ManageContext);

  //#endregion

  //#region useEffects

  useEffect(() => {
    // Load product names with productIds
    const assemblyBatches = async () => {
      if (!state.mainDocs) return;

      const batches = state.mainDocs as BatchObject[];

      const docs: AssemblyBatchObject[] = (
        await Promise.all(
          batches.map(async (document) => {
            try {
              const product = await getDocFromFirestore<ProductObject>(
                'products',
                document.product_id
              );

              const productType = await getDocFromFirestore<ProductTypeObject>(
                'productTypes',
                product.productType_id
              );

              const updatedBatch = {
                ...document,
                productName: product.name,
                productIsActive: product.isActive,
                productTypeIsActive: productType.isActive,
              } as AssemblyBatchObject;

              console.log(updatedBatch);
              return updatedBatch;
            } catch (error) {
              console.log(error);
              return null;
            }
          })
        )
      ).filter((doc) => doc !== null) as AssemblyBatchObject[];

      // Filter isActive
      const filterActiveDocs = !state.isDisplayActiveOnly
        ? docs
        : docs
            .filter((doc) => Boolean(doc))
            .filter(
              (doc) =>
                new Date(doc.EXP).getTime() > new Date().getTime() &&
                doc.soldQuantity < doc.totalQuantity &&
                doc.productIsActive &&
                doc.productTypeIsActive
            );

      console.log(filterActiveDocs);

      setDisplayMainDocs(() => filterActiveDocs);
    };

    assemblyBatches();
  }, [state.mainDocs, state.isDisplayActiveOnly]);

  //#endregion

  return (
    <>
      {displayMainDocs?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {index + 1}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {doc.productName}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {doc.soldQuantity}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {doc.totalQuantity}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {new Date(doc.MFG).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {new Date(doc.EXP).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Typography>
          </TableCell>
          <TableCell>{formatCurrency(doc.price)}</TableCell>
          <TableCell>
            <RowActionButtons doc={doc} />
          </TableCell>
        </TableRow>
      )) ?? <TableRow>Error loading body</TableRow>}
    </>
  );
};

export default memo(GeneratedBatchTableBody);
