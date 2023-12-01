import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BranchTableRow } from '@/models/branch';
import { Dayjs } from 'dayjs';
import { BillTableRow } from '@/models/bill';
import { getBillTableRows } from '@/lib/DAO/billDAO';
import { getBatches } from '@/lib/DAO/batchDAO';
import { Typography } from '@mui/material';

type rowType = {
  label: string;
  amount: number;
  total: number;
  percent: number;
};

const headerSX = {
  fontSize: 'body2.fontSize',
  color: 'common.black',
  fontWeight: 'body1.fontWeight',
  fontFamily: 'body2.fontFamily',
};

export default function StatisticTable({
  branchData,
  statisticDate,
}: {
  branchData: BranchTableRow | undefined;
  statisticDate: Dayjs | null;
}) {
  const [rows, setRows] = React.useState<rowType[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      if (!statisticDate) {
        return;
      }
      if (!branchData) {
        return;
      }

      const date = new Date(statisticDate.format('YYYY-MM-DD'));
      const { manager, ...branch } = branchData;
      const bills: BillTableRow[] = (await getBillTableRows(branch)).filter(
        (bill) => {
          const billDate = new Date(bill.created_at);
          return (
            billDate.getDate() === date.getDate() &&
            billDate.getMonth() === date.getMonth() &&
            billDate.getFullYear() === date.getFullYear()
          );
        }
      );

      var firstLabel = 'Đơn hàng';
      var amountSuccessBill = 0;
      var totalBill = 0;

      var secondLabel = 'Giao hàng';
      var amountSuccessDelivery = 0;
      var totalDeliver = 0;

      var thirdLabel = 'Sản phẩm bán';
      var amountSoldProduct = 0;
      var totalProduct = 0;

      for (let b of bills) {
        if (b.state === 'paid') {
          amountSuccessBill += 1;
          amountSuccessDelivery += 1;
        }
        totalBill += 1;
        totalDeliver += 1;
      }

      const batches = (await getBatches()).filter((b) => {
        const batchDate = new Date(b.mfg);
        return (
          batchDate.getDate() === date.getDate() &&
          batchDate.getMonth() === date.getMonth() &&
          batchDate.getFullYear() === date.getFullYear() &&
          b.branch_id === branch.id
        );
      });

      batches.map((b) => {
        amountSoldProduct += b.sold;
        totalProduct += b.quantity;
      });

      setRows([
        {
          label: firstLabel,
          amount: amountSuccessBill,
          total: totalBill,
          percent:
            totalBill == 0
              ? 0
              : Math.round((amountSuccessBill / totalBill) * 100 * 100) / 100,
        },
        {
          label: secondLabel,
          amount: amountSuccessDelivery,
          total: totalDeliver,
          percent:
            totalDeliver == 0
              ? 0
              : Math.round((amountSuccessDelivery / totalDeliver) * 100 * 100) /
                100,
        },
        {
          label: thirdLabel,
          amount: amountSoldProduct,
          total: totalProduct,
          percent:
            totalProduct == 0
              ? 0
              : Math.round((amountSoldProduct / totalProduct) * 100 * 100) /
                100,
        },
      ]);
    };
    fetchData();
  }, [statisticDate]);

  return (
    <TableContainer
      sx={{
        height: '100%',
      }}
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={headerSX}>Thông số</TableCell>
            <TableCell sx={headerSX} align="center">
              Thành công
            </TableCell>
            <TableCell sx={headerSX} align="center">
              Tổng
            </TableCell>
            <TableCell sx={headerSX} align="center">
              Phần trăm (%)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell align="center">{row.amount}</TableCell>
              <TableCell align="center">{row.total}</TableCell>
              <TableCell align="center">{row.percent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
