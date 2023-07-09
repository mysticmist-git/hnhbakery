import MyModal from '@/components/order/MyModal';
import {
  getCollection,
  getCollectionWithQuery,
  getDocFromFirestore,
} from '@/lib/firestore';
import { billStatusParse } from '@/lib/manage/manage';
import { BillObject, CustomBill, DeliveryObject } from '@/lib/models';
import { formatPrice } from '@/lib/utils';
import {
  Button,
  Card,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';

const MyTable = ({
  billsData,
  handleViewBill,
}: {
  billsData: CustomBill[];
  handleViewBill: (value: CustomBill) => void;
}) => {
  const isBillEmpty = useMemo(() => {
    return billsData.length === 0;
  }, [billsData]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell align="right">Khách hàng</TableCell>
              <TableCell align="center">Ngày đặt</TableCell>
              <TableCell align="right">Tổng đơn</TableCell>
              <TableCell align="right">Tình trạng</TableCell>
              <TableCell align="center">Hành động</TableCell>
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
                <TableCell align="right">
                  {new Date(row.created_at ?? new Date()).toLocaleString(
                    'vi-VI',
                    {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }
                  )}
                </TableCell>
                <TableCell align="right">
                  {formatPrice(row?.totalPrice ?? 0)}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      color: row.state === 1 ? 'green' : 'red',
                    }}
                  >
                    {billStatusParse(row.state ?? -2)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2} justifyContent={'center'}>
                    <Button
                      variant="contained"
                      onClick={() => handleViewBill(row)}
                    >
                      Xem
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isBillEmpty && (
        <Typography variant="body2">Không tồn tại hóa đơn nào.</Typography>
      )}
    </>
  );
};

const Order = ({ bills }: { bills: string }) => {
  //#region States

  const [open, setOpen] = React.useState(false);
  const [currentViewBill, setCurrentViewBill] = useState<CustomBill | null>(
    null
  );
  const [billsData, setBillsData] = useState<CustomBill[]>([]);

  //#endregion

  //#region  UseEffects

  useEffect(() => {
    const parsedBills = (JSON.parse(bills) as CustomBill[]) ?? [];

    setBillsData(() => parsedBills);
  }, []);

  //#endregion

  //#region Handlers

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleViewBill = (value: CustomBill) => {
    handleOpen();
    setCurrentViewBill(() => value);
  };

  const handleBillDataChange = (value: CustomBill) => {
    setBillsData(() => {
      // Find the id and alter the value of it with new value
      return billsData.map((bill) => {
        if (bill.id === value.id) {
          return value;
        } else {
          return bill;
        }
      });
    });
  };

  //#endregion

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
        {/* Title */}
        <Stack>
          <Typography>Đơn hàng</Typography>
        </Stack>

        {/* Table */}
        <MyTable billsData={billsData} handleViewBill={handleViewBill} />

        {/* Modals */}
        <MyModal
          open={open}
          handleClose={handleClose}
          bill={currentViewBill}
          handleBillDataChange={handleBillDataChange}
        />
      </Card>
    </Container>
  );
};

export const getServerSideProps = async () => {
  let finalBills: CustomBill[] = [];

  try {
    const bills = await getCollection<BillObject>('bills');

    finalBills = await Promise.all(
      bills.map(async (bill) => {
        let salePercent: number = 0;

        if (Boolean(bill.sale_id && bill.sale_id !== '')) {
          const sale = await getDocFromFirestore(
            'sales',
            bill.sale_id as string
          );

          salePercent = sale.percent;
          // saleId = sale.id;
        }

        const deliveries = await getCollectionWithQuery<DeliveryObject>(
          'deliveries',
          where('bill_id', '==', bill.id)
        );

        const customerName = deliveries[0].name;
        const customerTel = deliveries[0].tel;
        const customerAddress = deliveries[0].address;
        const deliveryPrice = deliveries[0].price;

        return {
          ...bill,
          customerName: customerName,
          customerTel: customerTel,
          customerAddress: customerAddress,
          deliveryPrice: deliveryPrice,
          salePercent: salePercent,
        } as CustomBill;
      })
    );

    return {
      props: {
        bills: JSON.stringify(finalBills),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        bills: [],
      },
    };
  }
};

export default Order;
