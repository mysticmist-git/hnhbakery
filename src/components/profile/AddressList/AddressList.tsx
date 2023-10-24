import { CustomIconButton } from '@/components/buttons';
import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import CheckboxList from '../CheckboxList';
import XacNhanXoa_Dialog from '../XacNhanXoa_Dialog';
import { UserTableRow } from '@/models/user';
import Address from '@/models/address';
import { deleteAddress } from '@/lib/DAO/addressDAO';

export default function AddressList({
  userData,
  textStyle,
}: {
  textStyle: any;
  userData: UserTableRow | undefined;
}) {
  const theme = useTheme();

  const [checked, setChecked] = React.useState(['']);

  const handleSetChecked = (value: Address) => {
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const [editItem, setEditItem] = useState({ editState: false, index: -1 });

  const handleSetEditItem = (editState: boolean, index: number) => {
    setEditItem({ editState, index });
  };

  const handleDeleteAll = () => {
    setOpenXoaDiaChi(true);
  };

  const [openXoaDiaChi, setOpenXoaDiaChi] = useState(false);

  const handleCloseXoaDiaChi = () => {
    setOpenXoaDiaChi(false);
  };

  const handleSnackbarAlert = useSnackbarService();

  const handleXacNhan = async () => {
    try {
      if (!checked.length && userData) {
        checked.forEach(async (a: string) => {
          await deleteAddress(userData.group_id, userData.id!, a);
        });
        handleSnackbarAlert('success', 'Xóa địa chỉ thành công!');
        handleCloseXoaDiaChi();
      }
    } catch (error) {
      console.log(error);
      handleSnackbarAlert('error', 'Xóa địa chỉ không thành công!');
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Box
            display={'flex'}
            justifyContent="space-between"
            alignItems="center"
            flexDirection={'row'}
          >
            <Typography
              align="center"
              variant="button"
              color={theme.palette.common.black}
              sx={{ py: 1 }}
            >
              Địa chỉ giao hàng
            </Typography>
            {checked.length > 1 && (
              <CustomIconButton
                onClick={handleDeleteAll}
                disabled={editItem.editState}
                sx={{ color: theme.palette.secondary.main }}
              >
                <DeleteRoundedIcon fontSize="small" />
              </CustomIconButton>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <CheckboxList
            textStyle={textStyle}
            userData={userData}
            checked={checked}
            handleSetChecked={handleSetChecked}
            editItem={editItem}
            handleSetEditItem={handleSetEditItem}
          />
        </Grid>
      </Grid>

      <XacNhanXoa_Dialog
        open={openXoaDiaChi}
        handleClose={handleCloseXoaDiaChi}
        handleXacNhan={handleXacNhan}
      />
    </>
  );
}
