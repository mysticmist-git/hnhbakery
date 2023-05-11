import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete, Wysiwyg } from '@mui/icons-material';
import { DocumentData, doc, getDoc, getDocs } from 'firebase/firestore';
import theme from '@/styles/themes/lightTheme';
import { TableActionButton } from './TableActionButton';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { display } from '@mui/system';
import { CollectionName } from '@/lib/models/utilities';
import GeneratedTableHead from './components/GeneratedTableHead';
import GeneratedTableBody from './components/GeneratedTableBody';

export interface DataTableProps {
  mainDocs: DocumentData[];
  mainCollectionName: CollectionName;
  handleViewRow: any;
  handleDeleteRow: any;
  setModalMode: any;
}

const CustomDataTable = ({
  mainDocs,
  mainCollectionName,
  handleViewRow,
  handleDeleteRow,
  setModalMode,
}: DataTableProps) => {
  const [displayMainDocs, setDisplayMainDocs] = useState<DocumentData[]>([]);

  useEffect(() => {
    // Load product type names with productTypesIds
    const getProductTypeNames = async () => {
      const docs = await Promise.all(
        mainDocs.map(async (document) => {
          console.log('Document received: ', document);
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
    };

    // Load product names with productIds
    const getProductNames = async () => {
      const docs = await Promise.all(
        mainDocs.map(async (document) => {
          console.log('Document received: ', document);
          const docRef = doc(db, CollectionName.Products, document.product_id);
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
    };

    switch (mainCollectionName) {
      case CollectionName.Products:
        getProductTypeNames();
        break;
      case CollectionName.Batches:
        getProductNames();
      default:
        break;
    }
  }, [mainDocs]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <GeneratedTableHead mainCollectionName={mainCollectionName} />
          </TableRow>
        </TableHead>
        <TableBody>
          <GeneratedTableBody
            mainDocs={mainDocs}
            mainCollectionName={mainCollectionName}
            displayMainDocs={displayMainDocs}
            handleViewRow={handleViewRow}
            handleDeleteRow={handleDeleteRow}
            setModalMode={setModalMode}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomDataTable;
