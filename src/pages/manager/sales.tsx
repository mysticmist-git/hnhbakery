import { TableActionButton } from '@/components/buttons';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import { BillObject, SaleObject, SuperDetail_SaleObject } from '@/lib/models';
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
import { useEffect, useState } from 'react';
import { SaleTable } from '../../components/sale/SaleTable';
import { MyModal } from '../../components/sale/MyModal';
import { ModalState } from '../../components/sale/ModalState';
import { MyModalAdd } from '../../components/sale/MyModalAdd';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Sales = ({ saleData }: { saleData: string }) => {
  const [sales, setSales] = useState<SuperDetail_SaleObject[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const parsedSales =
      (JSON.parse(saleData) as SuperDetail_SaleObject[]) ?? [];
    setSales(() => parsedSales);
  }, []);

  const handleSaleDataChange = (value: SuperDetail_SaleObject) => {
    setSales(() => {
      return sales.map((sale) => {
        if (sale.id === value.id) {
          return value;
        } else {
          return sale;
        }
      });
    });
  };

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

  const handleSaleDataChangeAdd = async () => {
    const sales = await getCollection<SaleObject>(COLLECTION_NAME.SALES);
    const bills = await getCollection<BillObject>(COLLECTION_NAME.BILLS);

    const final: SuperDetail_SaleObject[] = sales.map((sale) => {
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

    setSales(() => final);
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
                handleSaleDataChangeAdd={handleSaleDataChangeAdd}
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
              handleSaleDataChange={handleSaleDataChange}
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              saleState={saleState}
              setSaleState={setSaleState}
              handleSaleDataChange={handleSaleDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const sales = await getCollection<SaleObject>(COLLECTION_NAME.SALES);
    const bills = await getCollection<BillObject>(COLLECTION_NAME.BILLS);

    const final: SuperDetail_SaleObject[] = sales.map((sale) => {
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

    return {
      props: {
        saleData: JSON.stringify(final),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        saleData: '',
      },
    };
  }
};
export default Sales;
