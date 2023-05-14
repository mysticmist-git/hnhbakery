import {
  ManageActionType,
  ManageContextType,
} from '@/pages/manager/lib/manage';
import { ManageContext } from '@/pages/manager/manage';
import theme from '@/styles/themes/lightTheme';
import { Wysiwyg, Delete } from '@mui/icons-material';
import { TableRow, TableCell, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { CustomDataTableContext } from '../CustomDataTable';
import { TableActionButton } from '../TableActionButton';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { DocumentData, doc, getDoc } from 'firebase/firestore';

const GeneratedBatchTableBody = () => {
  const [displayMainDocs, setDisplayMainDocs] = useState<DocumentData[]>([]);
  const { state, dispatch, handleViewRow, handleDeleteRow } =
    useContext<ManageContextType>(ManageContext);

  useEffect(() => {
    // Load product names with productIds
    const getProductNames = async () => {
      try {
        const docs = await Promise.all(
          state.mainDocs.map(async (document) => {
            console.log('Document received: ', document);
            const docRef = doc(
              db,
              CollectionName.Products,
              document.product_id,
            );
            const docSnap = await getDoc(docRef);
            return {
              ...document,
              productName:
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

    getProductNames();
  }, [state.mainDocs]);

  return (
    <>
      {displayMainDocs?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell>
            <Typography>{index + 1}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.productName}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.soldQuantity}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.totalQuantity}</Typography>
          </TableCell>
          <TableCell>
            <Typography>
              {new Date(doc.MFG).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography>
              {new Date(doc.EXP).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </TableCell>
          <TableCell>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <TableActionButton
                variant="contained"
                startIcon={<Wysiwyg />}
                onClick={() => {
                  dispatch({
                    type: ManageActionType.SET_CRUD_MODAL_MODE,
                    payload: 'update',
                  });
                  handleViewRow(doc);
                }}
              >
                Xem
              </TableActionButton>
              <TableActionButton
                variant="contained"
                startIcon={<Delete />}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
                onClick={() => handleDeleteRow(doc.id)}
              >
                Xóa
              </TableActionButton>
            </Box>
          </TableCell>
        </TableRow>
      )) ?? <TableRow>Error loading body</TableRow>}
    </>
  );
};

export default GeneratedBatchTableBody;
