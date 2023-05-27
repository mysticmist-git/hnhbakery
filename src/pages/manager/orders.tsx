import {
  getCollection,
  getDocFromFirestore,
} from '@/lib/firestore/firestoreLib';
import { BillObject } from '@/lib/models/Bill';
import {
  Box,
  Card,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import React, { useMemo } from 'react';

const Order = ({ bills }: { bills: string }) => {
  // #region UseMemos

  const billsData: CustomBill[] = useMemo(
    () => JSON.parse(bills) as CustomBill[],
    [],
  );

  // #endregion

  return (
    <Container
      sx={{
        mt: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        <Typography>Đơn hàng</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell align="right">Khách hàng</TableCell>
                <TableCell align="right">Ngày đặt</TableCell>
                <TableCell align="right">Tổng đơn</TableCell>
                <TableCell align="right">Tình trạng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billsData.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.customerName}</TableCell>
                  <TableCell align="right">{row.created_at}</TableCell>
                  <TableCell align="right">{row.totalPrice}</TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

interface CustomBill extends BillObject {
  customerName?: string;
}

export const getServerSideProps = async () => {
  let finalBills: CustomBill[] = [];

  try {
    const bills = await getCollection<BillObject>('bills');

    finalBills = await Promise.all(
      bills.map(async (bill) => {
        const customerName = Boolean(bill.user_id && bill.user_id !== '')
          ? await getDocFromFirestore('users', bill.user_id as string)
          : 'Không tài khoản';

        return {
          ...bill,
          customerName: customerName,
        } as CustomBill;
      }),
    );
  } catch (error) {
    console.log(error);

    return {
      props: {
        bills: [],
      },
    };
  }

  return {
    props: {
      bills: JSON.stringify(finalBills),
    },
  };
};

export default Order;
