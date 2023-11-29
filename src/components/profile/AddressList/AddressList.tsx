import { CustomIconButton } from '@/components/buttons';
import { deleteAddress } from '@/lib/DAO/addressDAO';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import { UserTableRow } from '@/models/user';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import CheckboxList from '../CheckboxList';
import XacNhanXoa_Dialog from '../XacNhanXoa_Dialog';

export default function AddressList({
  userData,
  textStyle,
  reload,
}: {
  textStyle: any;
  userData: UserTableRow | undefined;
  reload: () => void;
}) {
  //#region Hooks

  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [checked, setChecked] = React.useState(['']);
  const [editItem, setEditItem] = useState({ editState: false, index: -1 });
  const [openXoaDiaChi, setOpenXoaDiaChi] = useState(false);

  //#endregion

  //#region Handlers

  const handleXacNhan = async () => {
    console.log('run');
    console.log(checked);

    if (!userData) {
      console.log('Please login');
      handleSnackbarAlert('warning', 'Vui lòng đăng nhập');
      return;
    }

    try {
      if (checked.length > 0) {
        const result = await Promise.allSettled(
          checked.map(async (a: string) => {
            await deleteAddress(userData.group_id, userData.id!, a);
          })
        );

        console.log(result);

        handleSnackbarAlert('success', 'Xóa địa chỉ thành công!');
        handleCloseXoaDiaChi();
        reload();
      }
    } catch (error) {
      console.log(error);
      handleSnackbarAlert('error', 'Xóa địa chỉ không thành công!');
    }
  };

  const handleCloseXoaDiaChi = () => {
    setOpenXoaDiaChi(false);
  };

  const handleDeleteAll = () => {
    setOpenXoaDiaChi(true);
  };

  const handleSetEditItem = (editState: boolean, index: number) => {
    setEditItem({ editState, index });
  };

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

  //#endregion

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
            component={'div'}
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
            reload={reload}
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
