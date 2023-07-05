import { Box, Grid, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { CustomIconButton } from '../Inputs/Buttons';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { CheckboxList } from './CheckboxList';
import { XacNhanXoa_Dialog } from './XacNhanXoa_Dialog';
export function AddressList(props: any) {
  const { textStyle, userData } = props;
  const theme = useTheme();

  const [checked, setChecked] = React.useState(['']);
  const handleSetChecked = (value: string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
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
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
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
      <XacNhanXoa_Dialog open={open} handleClose={handleClose} />
    </>
  );
}
