import { ManageContext } from '@/lib/contexts';
import theme from '@/styles/themes/lightTheme';
import { TableRow, TableCell, Typography } from '@mui/material';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import RowActionButtons from './RowActionButtons';
import { ManageContextType } from '@/lib/localLib/manage';
import formatCurrency from '@/utilities/formatCurrency';

const GeneratedBatchTableBody = () => {
  const [displayMainDocs, setDisplayMainDocs] = useState<DocumentData[]>([]);
  const { state } = useContext<ManageContextType>(ManageContext);

  useEffect(() => {
    // Load product names with productIds
    const getProductNames = async () => {
      try {
        const docs: DocumentData[] = await Promise.all(
          state.mainDocs.map(async (document) => {
            const docRef = doc(
              db,
              CollectionName.Products,
              document.product_id
            );
            const docSnap = await getDoc(docRef);
            return {
              ...document,
              productName:
                docSnap.exists() && docSnap.data() !== null
                  ? docSnap.data().name
                  : null,
            };
          })
        );

        // Filter isActive
        const filterActiveDocs = !state.isDisplayActiveOnly
          ? docs
          : docs
              .filter(
                (doc) => new Date(doc.EXP).getTime() > new Date().getTime()
              )
              .filter((doc) => doc.soldQuantity < doc.totalQuantity);

        setDisplayMainDocs(() => filterActiveDocs);
      } catch (err) {
        console.log('Err', err);
      }
    };

    getProductNames();
  }, [state.mainDocs, state.isDisplayActiveOnly]);

  const TableBody = useMemo(() => {
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
  }, [displayMainDocs]);

  return TableBody;
};

export default memo(GeneratedBatchTableBody);
