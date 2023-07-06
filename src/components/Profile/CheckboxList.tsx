import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { AddressItem } from './AddressItem';

export function CheckboxList(props: any) {
  const {
    textStyle,
    userData,
    checked,
    handleSetChecked,
    editItem,
    handleSetEditItem,
  } = props;
  const { addresses } = userData;

  const theme = useTheme();
  return (
    <List sx={{ width: '100%', p: 0, m: 0 }}>
      {addresses?.map((value: string, index: number) => {
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
                  checked={checked.indexOf(value) !== -1}
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
              userData={userData}
              editItem={editItem}
              handleSetEditItem={handleSetEditItem}
            />
          </ListItem>
        );
      })}
    </List>
  );
}