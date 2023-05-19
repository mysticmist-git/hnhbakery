import {
  List,
  ListSubheader,
  ListItemButton,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import { Box } from '@mui/system';
import { selectedIdsLookupSelector } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CustomTextFieldWithLabel from './CustomTextFieldWithLabel';

const BasicList = ({
  header,
  items,
  setSelectedItem,
}: {
  header?: string;
  items: string[];
  setSelectedItem: any;
}) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List
        subheader={
          header && (
            <ListSubheader component="div" id="nested-list-subheader">
              {header}
            </ListSubheader>
          )
        }
      >
        {items?.map((item, itemIndex) => (
          <ListItemButton
            onClick={() => setSelectedItem({ index: itemIndex, value: item })}
          >
            <ListItem key={itemIndex} disablePadding>
              <ListItemText primary={item} />
            </ListItem>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

interface MultipleValueInputProps {
  header: string;
  values: string[];
  onChange: (listItems: string[]) => void;
}

export default function MultipleValueInput({
  header,
  values,
  onChange,
}: MultipleValueInputProps) {
  const [listItems, setListItems] = useState<string[]>(values);

  interface SelectedValue {
    index: number;
    value: string;
  }

  const [selectedItem, setSelectedItem] = useState<SelectedValue | null>();

  const handleAddRow = () => {
    if (!selectedItem) return;
    if (!listItems) return;

    setListItems([...listItems, selectedItem.value]);
    setSelectedItem(null);
  };

  const handleUpdateRow = () => {
    if (!selectedItem) return;

    const newListItems = [...listItems];
    newListItems[selectedItem.index] = selectedItem.value;

    setListItems(newListItems);
  };

  const handleDeleteRow = () => {
    if (!selectedItem) return;

    const newListItems = [...listItems];
    newListItems.splice(selectedItem.index, 1);

    setListItems(newListItems);
  };

  useEffect(() => {
    onChange(listItems);
  }, [listItems]);

  return (
    <>
      <Divider
        sx={{
          my: '20px',
        }}
      />
      <Box>
        <BasicList
          header={header}
          items={listItems}
          setSelectedItem={setSelectedItem}
        />
        <Box sx={{ marginTop: '16px' }}>
          <Button variant="contained" onClick={handleAddRow}>
            Add
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateRow}
            sx={{ marginLeft: '8px' }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteRow}
            sx={{ marginLeft: '8px' }}
          >
            Delete
          </Button>
        </Box>
        <CustomTextFieldWithLabel
          label="Giá trị"
          value={selectedItem?.value || ''}
          onChange={(event: any) => {
            console.log(selectedItem);
            setSelectedItem({
              ...selectedItem,
              value: event.target.value,
            } as SelectedValue);
          }}
          sx={{ marginRight: '8px', marginTop: '32px' }}
        />
      </Box>
      <Divider
        sx={{
          my: '20px',
        }}
      />
    </>
  );
}
