import { createAddress } from '@/lib/DAO/addressDAO';
import { getProvinces } from '@/lib/DAO/provinceDAO';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import Province from '@/models/province';
import { UserTableRow } from '@/models/user';
import { Add, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import AddressItem from '../AddressList/AddressItem';

export default function CheckboxList({
  textStyle,
  userData,
  checked,
  handleSetChecked,
  editItem,
  handleSetEditItem,
  reload,
}: {
  textStyle: any;
  userData: UserTableRow | undefined;
  checked: string[];
  handleSetChecked: (value: Address) => void;
  editItem: { editState: boolean; index: number };
  handleSetEditItem: (editState: boolean, index: number) => void;
  reload: () => void;
}) {
  //#region Hooks

  const { addresses, ...data } = userData ?? {};
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [provinces, setProvinces] = useState<Province[]>([]);

  //#endregion

  //#region Handlers

  useEffect(() => {
    async function getData() {
      try {
        setProvinces(await getProvinces());
      } catch (error) {
        console.log('Fail to fetch provinces', error);
        setProvinces([]);
      }
    }

    getData();
  }, []);

  //#endregion

  //#region Handlers

  const handleAddAddress = useCallback(async () => {
    if (!userData) {
      return;
    }

    const newAddress: Omit<Address, 'id'> = {
      address: '',
      user_id: userData.id,
      province_id: '',
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      await createAddress(
        userData.group_id,
        userData.id,
        newAddress as Address
      );

      reload();

      handleSnackbarAlert('success', 'Thêm địa chỉ mới thành công!');
    } catch (error) {
      console.log('Fail to add new address', error);
      handleSnackbarAlert('warning', 'Thêm địa chỉ mới thất bại!');
    }
  }, [handleSnackbarAlert, reload, userData]);

  //#endregion

  return (
    <List sx={{ width: '100%', p: 0, m: 0 }}>
      {addresses?.map((value, index) => {
        const labelId = `checkbox-list-label-${index}`;

        return (
          <ListItem key={index} sx={{ px: 0, py: 2 }}>
            <ListItemButton
              sx={{ p: 0, mr: 1 }}
              role={undefined}
              onClick={() => handleSetChecked(value)}
              disabled={editItem.editState}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  color="secondary"
                  sx={{
                    color: theme.palette.secondary.main,
                  }}
                />
              </ListItemIcon>
            </ListItemButton>

            <AddressItem
              textStyle={textStyle}
              value={value}
              index={index}
              disabled={
                editItem.editState == false
                  ? true
                  : editItem.index == index
                  ? false
                  : true
              }
              handleSetEditItem={handleSetEditItem}
              userData={userData}
              editItem={editItem}
              provinces={provinces}
            />
          </ListItem>
        );
      })}

      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddAddress}
        >
          <Add />
        </Button>
      </Box>

      {addresses?.length == 0 && (
        <ListItem>
          <Typography
            align="center"
            variant="h3"
            color={theme.palette.text.secondary}
            sx={{ width: '100%' }}
          >
            Trống
          </Typography>
        </ListItem>
      )}
    </List>
  );
}
