import { TableRow, TableCell, Typography } from '@mui/material';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { ManageContext } from '@/lib/contexts';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import RowActionButtons from './RowActionButtons';
import { ManageContextType } from '@/lib/localLib/manage';
import theme from '@/styles/themes/lightTheme';
import { table } from 'console';

const GeneratedProductTableBody = () => {
  const [displayMainDocs, setDisplayMainDocs] = useState<DocumentData[]>([]);
  const {
    state,
    dispatch,
    handleViewRow,
    handleDeleteRowOnFirestore: handleDeleteRow,
    handleSearchFilter,
  } = useContext<ManageContextType>(ManageContext);

  useEffect(() => {
    // Load product type names with productTypesIds
    const getProductTypeNames = async () => {
      try {
        const docs = await Promise.all(
          state.mainDocs.map(async (document) => {
            const docRef = doc(
              db,
              CollectionName.ProductTypes,
              document.productType_id,
            );
            const docSnap = await getDoc(docRef);
            return {
              ...document,
              productTypeName:
                docSnap.exists() && docSnap.data() !== null
                  ? docSnap.data().name
                  : null,
            };
          }),
        );

        setDisplayMainDocs(docs);
      } catch (err) {
        console.log('Err', err);
      }
    };

    getProductTypeNames();
  }, [state.mainDocs]);

  const TableBody = useMemo(() => {
    return (
      <>
        {handleSearchFilter(displayMainDocs)?.map((doc, index) => (
          <TableRow
            key={doc.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              <Typography sx={{ color: theme.palette.common.black }}>
                {index + 1}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ color: theme.palette.common.black }}>
                {doc.name}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ color: theme.palette.common.black }}>
                {doc.productTypeName}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ color: theme.palette.common.black }}>
                {doc.description}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                sx={{
                  color: doc.isActive
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                }}
              >
                {doc.isActive ? 'Còn cung cấp' : 'Ngưng cung cấp'}
              </Typography>
            </TableCell>
            <TableCell>
              <RowActionButtons doc={doc} />
            </TableCell>
          </TableRow>
        )) ?? <TableRow>Error loading body</TableRow>}
      </>
    );
  }, [displayMainDocs, state.searchText]);

  return TableBody;
};

export default memo(GeneratedProductTableBody);
