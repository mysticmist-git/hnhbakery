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
          width: 70,
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
          width: 100,
          align: 'center',
        },
        {
          field: 'description',
          headerName: 'Mô tả',
          width: 320,
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
          width: 160,
          renderCell: (params: GridRenderCellParams) => {
            const isActive = params.value as boolean;
            const color = isActive ? 'green' : 'red';
            return (
              <Typography sx={{ color }} variant="body2">
                {statusTextResolver(isActive)}
              </Typography>
            );
          },
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
          width: 200,
          getActions: (params: GridRowModel) => [
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
          ],
        },
      ];
    case COLLECTION_NAME.PRODUCTS:
      return [];
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
        toolbar: GridToolbar,
        baseCheckbox: (props) => {
          return <Checkbox color="secondary" {...props} />;
        },
      }}
    />
  );
});
