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
import { ProductObject, ProductTypeObject } from '@/lib/models';
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
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridLogicOperator,
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
  const theme = useTheme();

  const isActive = params.value as boolean;
  const color = isActive
    ? theme.palette.success.main
    : theme.palette.error.main;

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

  const [productTypes, setProductTypes] = useState<ProductTypeObject[]>([]);

  const [products, setProducts] = useState<ProductObject[]>([]);

  //#endregion

  //#region useEffect

  useEffect(() => {
    async function fetchTypes() {
      let productTypes: ProductTypeObject[] = [];

      try {
        productTypes = await getCollection<ProductTypeObject>(
          COLLECTION_NAME.PRODUCT_TYPES
        );
      } catch (error) {
        console.log(error);
      }

      setProductTypes(() => productTypes);
    }

    async function fetchProducts() {
      let products: ProductObject[] = [];

      try {
        products = await getCollection<ProductObject>(COLLECTION_NAME.PRODUCTS);
      } catch (error) {
        console.log(error);
      }

      setProducts(() => products);
    }

    switch (props.collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        break;
      case COLLECTION_NAME.PRODUCTS:
        fetchTypes();
        break;
      case COLLECTION_NAME.BATCHES:
        fetchTypes();
        fetchProducts();
        break;
      default:
        break;
    }
  }, [props.collectionName]);

  //#endregion

  //#region useMemos

  const columns = useMemo(() => {
    return generateDatagridColumn();
  }, [props, productTypes, products]);

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
          {
            field: 'name',
            headerName: 'Tên',
            width: 160,
            filterable: false,
            hideable: false,
          },
          {
            field: 'productCount',
            headerName: 'Sản phẩm',
            type: 'number',
            align: 'center',
            hideable: false,
          },
          {
            field: 'description',
            headerName: 'Mô tả',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            sortable: false,
            filterable: false,
            hideable: false,
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
            hideable: false,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
            hideable: false,
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
            hideable: false,
          },
          {
            field: 'productType_id',
            headerName: 'Loại',
            type: 'singleSelect',
            valueOptions: productTypes.map((type) => type.id ?? ''),
            getOptionLabel: (value) => {
              return productTypes?.find((i) => i.id === value)?.name ?? 'Không';
            },
            valueFormatter: (params: GridValueFormatterParams) => {
              const typeName = productTypes.find(
                (i) => i.id === params.value
              )?.name;

              return typeName ?? 'Không tìm thấy';
            },
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            hideable: false,
          },
          {
            field: 'description',
            headerName: 'Mô tả',
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            hideable: false,
          },
          {
            field: 'variants',
            type: 'number',
            headerName: 'Biến thể',
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.value?.length ?? 0,
            hideable: false,
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
            hideable: false,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
            hideable: false,
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
            field: 'product_id',
            headerName: 'Sản phẩm',
            align: 'left',
            headerAlign: 'left',
            type: 'singleSelect',
            valueOptions: products?.map((type) => type.id ?? ''),
            getOptionLabel(value) {
              return products?.find((i) => i.id === value)?.name ?? 'Không';
            },
            valueFormatter: (params: GridValueFormatterParams) => {
              const productName = products.find(
                (i) => i.id === params.value
              )?.name;

              return productName ?? 'Không tìm thấy';
            },
            flex: 1,
            hideable: false,
          },
          {
            field: 'productType_id',
            headerName: 'Loại',
            align: 'left',
            headerAlign: 'left',
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
            flex: 1,
            hideable: false,
          },
          {
            field: 'material',
            headerName: 'Vật liệu',
            align: 'left',
            headerAlign: 'left',
            hideable: false,
          },
          {
            field: 'size',
            headerName: 'Kích cỡ',
            headerAlign: 'left',
            align: 'left',
            hideable: false,
          },
          {
            field: 'price',
            type: 'number',
            headerName: 'Giá',
            headerAlign: 'left',
            align: 'left',
            valueFormatter: (params) => formatPrice(params.value),
            hideable: false,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
            hideable: false,
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
        filterPanel: {
          // Force usage of "And" operator
          logicOperators: [GridLogicOperator.And],
          // Display columns by ascending alphabetical order
          columnsSort: 'asc',
          filterFormProps: {
            // Customize inputs by passing props
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
            deleteIconProps: {
              sx: {
                '& .MuiSvgIcon-root': { color: '#d32f2f' },
              },
            },
          },
          sx: {
            // Customize inputs using css selectors
            '& .MuiDataGrid-filterForm': { p: 2 },
            '& .MuiDataGrid-filterForm:nth-child(even)': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
            },
            '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
            '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
            '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
            '& .MuiDataGrid-filterFormValueInput': { width: 200 },
          },
        },
      }}
    />
  );
});
