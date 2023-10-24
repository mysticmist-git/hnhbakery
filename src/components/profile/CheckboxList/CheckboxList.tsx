import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import AddressItem from '../AddressList/AddressItem';
import { UserTableRow } from '@/models/user';
import Address from '@/models/address';

export default function CheckboxList({
  textStyle,
  userData,
  checked,
  handleSetChecked,
  editItem,
  handleSetEditItem,
}: {
  textStyle: any;
  userData: UserTableRow | undefined;
  checked: string[];
  handleSetChecked: (value: Address) => void;
  editItem: { editState: boolean; index: number };
  handleSetEditItem: (editState: boolean, index: number) => void;
}) {
  const { addresses, ...data } = userData ?? {};

  const theme = useTheme();
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
            />
          </ListItem>
        );
      })}

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
