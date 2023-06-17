import { COLLECTION_NAME } from '@/lib/constants';
import { TableCell } from '@mui/material';
import React, { memo } from 'react';

const GeneratedTableHead = ({ collectionName }: { collectionName: string }) => {
  switch (collectionName) {
    case COLLECTION_NAME.PRODUCT_TYPES:
      return (
        <>
          <TableCell>STT</TableCell>
          <TableCell width={200}>Tên loại sản phẩm</TableCell>
          <TableCell width={100}>Số sản phẩm</TableCell>
          <TableCell>Mô tả</TableCell>
          <TableCell width={150}>Trạng thái</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </>
      );
    case COLLECTION_NAME.PRODUCTS:
      return (
        <>
          <TableCell>STT</TableCell>
          <TableCell width={150}>Tên sản phẩm</TableCell>
          <TableCell width={150}>Loại sản phẩm</TableCell>
          <TableCell>Mô tả</TableCell>
          <TableCell width={150}>Trạng thái</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </>
      );
    case COLLECTION_NAME.BATCHES:
      return (
        <>
          <TableCell align="center">STT</TableCell>
          <TableCell align="center">Sản phẩm</TableCell>
          <TableCell align="center">Đã bán</TableCell>
          <TableCell align="center">Ngày sản xuất</TableCell>
          <TableCell align="center">Ngày hết hạn</TableCell>
          <TableCell align="center">Giá</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </>
      );
    default:
      return <div>Error generating header</div>;
  }
};

export default memo(GeneratedTableHead);
