import { TableActionButton } from '@/components/buttons';
import { ModalState, MyModal, MyModalAdd, SaleTable } from '@/components/sale';
import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  BillObject,
  SaleObject,
  SuperDetail_SaleObject,
  billConverter,
  saleConverter,
} from '@/lib/models';
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
import { useMemo, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Sales = ({ saleData }: { saleData: string }) => {
  const [rawSales, sLoading] = useCollectionData<SaleObject>(
    collection(db, COLLECTION_NAME.SALES).withConverter(saleConverter),
    {
      initialValue: [],
    }
  );

  const [bills, bLoading] = useCollectionData<BillObject>(
    collection(db, COLLECTION_NAME.BILLS).withConverter(billConverter),
    {
      initialValue: [],
    }
  );

  const sales = useMemo(() => {
    if (!rawSales || !bills || sLoading || bLoading) {
      return [];
    }

    return rawSales.map((sale) => {
      const filter_bills = bills.filter((bill) => {
        return bill.sale_id === sale.id;
      });
      const totalSaleAmount = filter_bills.reduce(
        (total, bill) => total + bill.saleAmount,
        0
      );
      return {
        ...sale,
        numberOfUse: filter_bills.length,
        totalSaleAmount: totalSaleAmount,
      };
    });
  }, [rawSales, bills, sLoading, bLoading]);

  const theme = useTheme();

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewSale, setCurrentViewSale] =
    useState<SuperDetail_SaleObject | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewSaleModalChiTiet = (value: SuperDetail_SaleObject) => {
    handleOpenModalChiTiet();
    setCurrentViewSale(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [saleState, setSaleState] = useState<SuperDetail_SaleObject | null>(
    null
  );

  const handleViewSaleModalState = (sale: SuperDetail_SaleObject) => {
    handleOpenModalState();
    setSaleState(() => sale);
  };
  //#endregion

  //#region Modal Add
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [contentAdd, setContentAdd] = useState<SaleObject | null>(null);

  const handleOpenModalAdd = () => setOpenModalAdd(true);
  const handleCloseModalAdd = () => setOpenModalAdd(false);

  const handleViewSaleModalAdd = (value: SaleObject | null) => {
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
                // onClick={handleReloadTable}
                sx={{
                  px: 2,
                  display: 'none',
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
