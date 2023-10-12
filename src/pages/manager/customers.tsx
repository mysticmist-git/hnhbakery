import { ModalState, MyModal } from '@/components/customer/MyModal';
import CustomerTable from '@/components/customer/MyTable';
import { getAddress, getAddresses } from '@/lib/DAO/addressDAO';
import { getBatchById } from '@/lib/DAO/batchDAO';
import { getBills } from '@/lib/DAO/billDAO';
import { getBillItems } from '@/lib/DAO/billItemDAO';
import { getDeliveryById } from '@/lib/DAO/deliveryDAO';
import { getFeedbacks } from '@/lib/DAO/feedbackDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getPaymentMethodById } from '@/lib/DAO/paymentMethodDAO';
import { getProduct, getProducts } from '@/lib/DAO/productDAO';
import { getProductTypeById, getProductTypes } from '@/lib/DAO/productTypeDAO';
import { getSaleById } from '@/lib/DAO/saleDAO';
import { getUsers } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';

import { BillTableRow } from '@/models/bill';
import { FeedbackTableRow } from '@/models/feedback';
import { UserTableRow } from '@/models/user';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Customer = () => {
  const [usersData, setUsersData] = useState<UserTableRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalUsers: UserTableRow[] = [];
        const customers = await getUsers(DEFAULT_GROUP_ID);

        for (let c of customers) {
          const billTableRows: BillTableRow[] = [];
          const bills = await getBills(c.group_id, c.id);
          for (let b of bills) {
            const billitems = await getBillItems(c.group_id, c.id, b.id);

            const billItems: BillTableRow['billItems'] = [];
            for (let bi of billitems) {
              const batch = await getBatchById(bi.batch_id);
              billItems.push({
                ...bi,
                batch: batch,
                productType: await getProductTypeById(batch!.product_type_id),
                product: await getProduct(
                  batch!.product_type_id,
                  batch!.product_id
                ),
                variant: await getVariant(
                  batch!.product_type_id,
                  batch!.product_id,
                  batch!.variant_id
                ),
              });
            }

            const sale =
              b.sale_id == '' ? undefined : await getSaleById(b.sale_id);

            const delivery = await getDeliveryById(b.delivery_id);

            billTableRows.push({
              ...b,
              paymentMethod: await getPaymentMethodById(b.payment_method_id),
              customer: { ...c },
              sale: sale,
              deliveryTableRow: {
                ...delivery!,
                address: await getAddress(
                  c.group_id,
                  c.id,
                  delivery!.address_id
                ),
              },
              billItems: billItems,
            });
          }

          const addresses = await getAddresses(c.group_id, c.id);

          const feedbackTableRows: FeedbackTableRow[] = [];
          const productTypes = await getProductTypes();

          for (let p of productTypes) {
            const products = await getProducts(p.id);
            for (let product of products) {
              const feedbacks = await getFeedbacks(p.id, product.id);
              for (let feedback of feedbacks) {
                if (feedback.user_id != c.id) {
                  continue;
                }
                feedbackTableRows.push({
                  ...feedback,
                  product: product,
                  user: { ...c },
                });
              }
            }
          }

          finalUsers.push({
            ...c,
            bills: billTableRows,
            addresses: addresses,
            feedbacks: feedbackTableRows,
          });
        }

        setUsersData(() => finalUsers || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //#region Phần phụ
  const theme = useTheme();
  const handleUserDataChange = (value: UserTableRow) => {
    setUsersData(() => {
      return usersData.map((user) => {
        if (user.id === value.id) {
          return value;
        } else {
          return user;
        }
      });
    });
  };
  //#endregion

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = React.useState(false);
  const [currentViewUser, setCurrentViewUser] = useState<UserTableRow | null>(
    null
  );

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewUserModalChiTiet = (value: UserTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewUser(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = React.useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [userState, setUserState] = useState<UserTableRow | null>(null);

  const handleViewUserModalState = (user: UserTableRow) => {
    handleOpenModalState();
    setUserState(() => user);
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
              Quản lý khách hàng
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              *Tìm kiếm theo mã, họ tên, email, số điện thoại, ngày sinh, trạng
              thái...
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {/* Table */}
            <CustomerTable
              usersData={usersData}
              handleViewUser={handleViewUserModalChiTiet}
              handleViewUserModalState={handleViewUserModalState}
            />

            {/* Modal chi tiết */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              user={currentViewUser}
              handleUserDataChange={handleUserDataChange}
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              userState={userState}
              setUserState={setUserState}
              handleUserDataChange={handleUserDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Customer;
