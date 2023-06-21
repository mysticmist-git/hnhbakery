import { COLLECTION_NAME } from '@/lib/constants';
import {
  DeleteRowHandler,
  ViewRowHandler,
  statusTextResolver,
} from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import { Delete, PanoramaFishEye, Visibility } from '@mui/icons-material';
import {
  Checkbox,
  LinearProgress,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridLoadingOverlay,
  GridRenderCellParams,
  GridRowModel,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { memo, useMemo } from 'react';
import { RowActionButtons } from './components';
import GeneratedTableBody from './components/GeneratedTableBody';
import GeneratedTableHead from './components/GeneratedTableHead';

function StatusCell(params: GridRenderCellParams) {
  const isActive = params.value as boolean;
  const color = isActive ? 'green' : 'red';
  return (
    <Typography sx={{ color }} variant="body2">
      {statusTextResolver(isActive)}
    </Typography>
  );
}

function ActionsCell(
  params: GridRowModel,
  handleViewRow: ViewRowHandler,
  handleDeleteRow: DeleteRowHandler
) {
  return [
    <GridActionsCellItem
      icon={<Visibility />}
      label="Xem"
      onClick={() => handleViewRow(params.id)}
    />,
    <GridActionsCellItem
      icon={<Delete />}
      label="Xóa"
      onClick={() => handleDeleteRow(params)}
    />,
  ];
}

const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

interface CustomDataTableProps {
  mainDocs: BaseObject[] | null;
  collectionName: string;
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
}

function generateDatagridColumn(
  collectionName: string,
  handleViewRow: ViewRowHandler,
  handleDeleteRow: DeleteRowHandler
): GridColDef[] {
  switch (collectionName) {
    case COLLECTION_NAME.PRODUCT_TYPES:
      return [
        {
          field: 'index',
          headerName: 'STT',
          valueGetter: (params: GridValueGetterParams) => {
            return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
          },
          align: 'center',
          headerAlign: 'center',
          sortable: false,
          disableColumnMenu: true,
        },
        { field: 'name', headerName: 'Tên', width: 160 },
        {
          field: 'productCount',
          headerName: 'Sản phẩm',
          type: 'number',
          align: 'center',
        },
        {
          field: 'description',
          headerName: 'Mô tả',
          flex: 1,
          align: 'left',
          headerAlign: 'left',
          sortable: false,
          filterable: false,
        },
        {
          field: 'isActive',
          headerName: 'Trạng thái',
          headerAlign: 'center',
          type: 'boolean',
          align: 'center',
          renderCell: StatusCell,
          sortComparator: (a, b) => {
            return a - b;
          },
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Hành động',
          headerAlign: 'right',
          align: 'right',
          getActions: (params) =>
            ActionsCell(params, handleViewRow, handleDeleteRow),
        },
      ];
    case COLLECTION_NAME.PRODUCTS:
      return [
        {
          field: 'index',
          headerName: 'STT',
          valueGetter: (params: GridValueGetterParams) => {
            return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
          },
          align: 'center',
          headerAlign: 'center',
          sortable: false,
          disableColumnMenu: true,
        },
        {
          field: 'name',
          headerName: 'Tên',
          align: 'left',
          headerAlign: 'left',
        },
        {
          field: 'productTypeName',
          headerName: 'Loại',
          align: 'left',
          headerAlign: 'left',
        },
        {
          field: 'description',
          headerName: 'Mô tả',
          align: 'left',
          headerAlign: 'left',
          flex: 1,
        },
        {
          field: 'variants',
          headerName: 'Biến thể',
          align: 'left',
          headerAlign: 'left',
          valueGetter: (params) => params.value?.length ?? 0,
        },
        {
          field: 'isActive',
          headerName: 'Trạng thái',
          headerAlign: 'center',
          type: 'boolean',
          align: 'center',
          renderCell: StatusCell,
          sortComparator: (a, b) => {
            return a - b;
          },
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Hành động',
          headerAlign: 'right',
          align: 'right',
          getActions: (params) =>
            ActionsCell(params, handleViewRow, handleDeleteRow),
        },
      ];
    case COLLECTION_NAME.BATCHES:
      return [];
    default:
      return [];
  }
}

export default memo(function CustomDataTable(props: CustomDataTableProps) {
  const columns = useMemo(() => {
    return generateDatagridColumn(
      props.collectionName,
      props.handleViewRow,
      props.handleDeleteRow
    );
  }, [props]);

  return (
    <DataGrid
      rows={props.mainDocs ?? []}
      loading={props.mainDocs === null}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
      autoHeight
      slots={{
        loadingOverlay: CustomLinearProgres,
        baseCheckbox: (props) => {
          return <Checkbox color="secondary" {...props} />;
        },
      }}
    />
  );
});
