import React, { memo, useContext } from 'react';
import { TableCell } from '@mui/material';
import { CollectionName } from '@/lib/models/utilities';
import { ManageContext } from '@/pages/manager/manage';
import { ManageContextType } from '@/lib/localLib/manage';

const GeneratedTableHead = () => {
  const { state } = useContext<ManageContextType>(ManageContext);

  switch (state.selectedTarget?.collectionName) {
    case CollectionName.ProductTypes:
      return (
        <>
          <TableCell>STT</TableCell>
          <TableCell width={150}>Tên sản phẩm</TableCell>
          <TableCell>Mô tả</TableCell>
          <TableCell width={150}>Trạng thái</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </>
      );
    case CollectionName.Products:
      return (
        <>
          <TableCell>STT</TableCell>
          <TableCell width={150}>Tên sản phẩm</TableCell>
          <TableCell>Loại sản phẩm</TableCell>
          <TableCell>Mô tả</TableCell>
          <TableCell width={150}>Trạng thái</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </>
      );
    case CollectionName.Batches:
      return (
        <>
          <TableCell align="center">STT</TableCell>
          <TableCell align="center">Sản phẩm</TableCell>
          <TableCell align="center">Đã bán</TableCell>
          <TableCell align="center">Tổng</TableCell>
          <TableCell align="center">Ngày sản xuất</TableCell>
          <TableCell align="center">Ngày hết hạn</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </>
      );
    default:
      return <div>Error generating header</div>;
  }
};

export default memo(GeneratedTableHead);
