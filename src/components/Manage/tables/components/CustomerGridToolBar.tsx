import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import React from 'react';

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingY: 1,
  paddingX: 3,
};

function CustomerGridToolBar() {
  return (
    <GridToolbarContainer sx={containerStyle}>
      <GridToolbarQuickFilter placeholder="Tìm kiếm" />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default CustomerGridToolBar;
