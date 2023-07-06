import { COLLECTION_NAME } from '@/lib/constants';
import {
  StorageBatchObject,
  fetchProductTypesForStoragePage,
  getCollection,
  getCollectionWithQuery,
} from '@/lib/firestore/firestoreLib';
import {
  DeleteRowHandler,
  ViewRowHandler,
  statusTextResolver,
} from '@/lib/localLib/manage';
import { ProductTypeObject } from '@/lib/models';
import BaseObject from '@/lib/models/BaseObject';
import formatPrice from '@/lib/utilities/formatCurrency';
import { Delete, Visibility } from '@mui/icons-material';
import {
  Autocomplete,
  Checkbox,
  LinearProgress,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridRenderCellParams,
  GridRowModel,
  GridToolbar,
  GridValueFormatterParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { memo, useEffect, useMemo, useState } from 'react';
import CustomerGridToolBar from './components/CustomerGridToolBar';

//#region Operators

//#endregion

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
      onClick={() => handleDeleteRow(params.row)}
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
export default memo(function CustomDataTable(props: CustomDataTableProps) {
  //#region States

  const [productTypes, setProductTypes] = useState<ProductTypeObject[] | null>(
    null
  );

  //#endregion

  useEffect(() => {
    async function fetchTypes() {
      let productTypes: ProductTypeObject[] | null = null;

      try {
        productTypes = await getCollection<ProductTypeObject>(
          COLLECTION_NAME.PRODUCT_TYPES
        );
      } catch (error) {
        console.log(error);
      }

      setProductTypes(() => productTypes);
    }

    switch (props.collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        break;
      case COLLECTION_NAME.PRODUCTS:
        if (!productTypes) {
          fetchTypes();
        }
        break;
      case COLLECTION_NAME.BATCHES:
        break;
      default:
        break;
    }
  }, [props.collectionName]);

  //#region useMemos

  const columns = useMemo(() => {
    return generateDatagridColumn();
  }, [props]);

  //#endregion

  //#region Functions

  function generateDatagridColumn(): GridColDef[] {
    switch (props.collectionName) {
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
            getActions: getActions,
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
            flex: 1,
          },
          {
            field: 'productType_id',
            headerName: 'Loại',
            type: 'singleSelect',
            valueOptions: productTypes?.map((type) => type.id ?? ''),
            getOptionLabel(value) {
              return productTypes?.find((i) => i.id === value)?.name ?? 'Không';
            },
            valueFormatter: (params: GridValueFormatterParams) => {
              if (!productTypes) return 'Không tìm thấy';

              const typeName = productTypes.find(
                (i) => i.id === params.value
              )?.name;

              return typeName ?? 'Không tìm thấy';
            },
            align: 'left',
            headerAlign: 'left',
            flex: 1,
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
            getActions: getActions,
          },
        ];
      case COLLECTION_NAME.BATCHES:
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
            field: 'productName',
            headerName: 'Sản phẩm',
            align: 'left',
            headerAlign: 'left',
            flex: 1,
          },
          {
            field: 'productTypeName',
            headerName: 'Loại',
            align: 'left',
            headerAlign: 'left',
            flex: 1,
          },
          {
            field: 'material',
            headerName: 'Vật liệu',
            align: 'left',
            headerAlign: 'left',
          },
          {
            field: 'size',
            headerName: 'Kích cỡ',
            headerAlign: 'left',
            align: 'left',
          },
          {
            field: 'price',
            type: 'number',
            headerName: 'Giá',
            headerAlign: 'left',
            align: 'left',
            valueFormatter: (params) => formatPrice(params.value),
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
          },
        ];
      default:
        return [];
    }

    //#region Functions

    function getActions(params: any) {
      return ActionsCell(params, props.handleViewRow, props.handleDeleteRow);
    }

    //#endregion
  }

  //#endregion

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
        toolbar: CustomerGridToolBar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
    />
  );
});
