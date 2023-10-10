import { TableActionButton } from '@/components/buttons';
import { ModalState, MyModal, MyModalAdd, SaleTable } from '@/components/sale';
import { getBills } from '@/lib/DAO/billDAO';
import { DEFAULT_GROUP_ID, getGroupById } from '@/lib/DAO/groupDAO';
import { getSales } from '@/lib/DAO/saleDAO';
import { getUsers } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import Sale, { SaleTableRow } from '@/models/sale';
import { Add, RestartAlt } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { collection } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Sales = () => {
  const [sales, setSales] = useState<SaleTableRow[]>([]);

  // const sales = useMemo(() => {
  //   if (!rawSales || !bills || sLoading || bLoading) {
  //     return [];
  //   }

  //   return rawSales.map((sale) => {
  //     const filter_bills = bills.filter((bill) => {
  //       return bill.sale_id === sale.id;
  //     });
  //     const totalSaleAmount = filter_bills.reduce(
  //       (total, bill) => total + bill.saleAmount,
  //       0
  //     );
  //     return {
  //       ...sale,
  //       numberOfUse: filter_bills.length,
  //       totalSaleAmount: totalSaleAmount,
  //     };
  //   });
  // }, [rawSales, bills, sLoading, bLoading]);

  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();
  const fetchData = async () => {
    try {
      const finalSales: SaleTableRow[] = (await getSales()).map((sale) => {
        return {
          ...sale,
          numberOfUse: 0,
          totalSalePrice: 0,
        };
      });

      const group = await getGroupById(DEFAULT_GROUP_ID);
      const users = await getUsers(group!.id);
      for (let u of users) {
        const bills = await getBills(group!.id, u.id);
        for (let b of bills) {
          const sale_id = b.sale_id;
          const sale = finalSales.find((sale) => sale.id === sale_id);
          if (sale) {
            sale.numberOfUse! += 1;
            sale.totalSalePrice! += b.sale_price;
          }
        }
      }

      setSales(() => finalSales || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewSale, setCurrentViewSale] = useState<SaleTableRow | null>(
    null
  );

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => {
    setOpenModalChiTiet(false);
    fetchData();
  };

  const handleViewSaleModalChiTiet = (value: SaleTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewSale(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [saleState, setSaleState] = useState<SaleTableRow | null>(null);

  const handleViewSaleModalState = (sale: SaleTableRow) => {
    handleOpenModalState();
    setSaleState(() => sale);
  };
  //#endregion

  //#region Modal Add
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [contentAdd, setContentAdd] = useState<Sale | null>(null);

  const handleOpenModalAdd = () => setOpenModalAdd(true);
  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
    fetchData();
  };

  const handleViewSaleModalAdd = (value: Sale | null) => {
    handleOpenModalAdd();
  };

  //#endregion

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý khuyến mãi
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 1,
              }}
            >
              <TableActionButton
                startIcon={<RestartAlt />}
                onClick={async () => {
                  await fetchData();
                  handleSnackbarAlert('success', 'Tải lại thành công!');
                }}
                sx={{
                  px: 2,
                }}
              >
                Tải lại
              </TableActionButton>

              <TableActionButton
                startIcon={<Add />}
                variant="contained"
                onClick={() => handleViewSaleModalAdd(contentAdd)}
              >
                Thêm
              </TableActionButton>

              {/* Modal thêm*/}
              <MyModalAdd
                open={openModalAdd}
                handleClose={handleCloseModalAdd}
                sale={contentAdd}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <SaleTable
              saleData={sales}
              handleViewSale={handleViewSaleModalChiTiet}
              handleViewSaleModalState={handleViewSaleModalState}
            />

            {/* Modal chi tiết */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              sale={currentViewSale}
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              saleState={saleState}
              setSaleState={setSaleState}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Sales;
