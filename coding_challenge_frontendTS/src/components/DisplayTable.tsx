import React, { useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRenderCellParams, useGridApiRef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Order } from './ParentComponent';

interface DisplayTableProps {
  data: Order[];
  changeSelection: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
  openEditModal: (OrderID: string, Customer: string, OrderType: number, isOpen: boolean) => void;
  rowCount: number;
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export enum EnumsOrdersOrderType {
  Standard = 'Standard',
  SalesOrder = 'Sales Order',
  PurchaseOrder = 'Purchase Order',
  TransferOrder = 'Transfer Order',
  ReturnOrder = 'Return Order'
}

const getEnumValueFromType = (type: string): number => {
  switch (type) {
    case 'Standard':
      return 0;
    case 'Sales Order':
      return 1;
    case 'Purchase Order':
      return 2;
    case 'Transfer Order':
      return 3;
    case 'Return Order':
      return 4;
    default:
      return -1;
  }
};

const DisplayTable: React.FC<DisplayTableProps> = ({ data, changeSelection, openEditModal, rowCount: totalRowCount, page, pageSize, setPage, setPageSize }) => {
  const apiRef = useGridApiRef();

  // useEffect(() => {
  //   apiRef.current.setPage(0);
  // }, [data]);

  const rowCountRef = useRef(totalRowCount || 0);
  const rowCount = React.useMemo(() => {
    if (totalRowCount !== undefined) {
      rowCountRef.current = totalRowCount;
    }
    return rowCountRef.current;
  }, [totalRowCount]);

  const handleEdit = (id: string, customer: string, type: string) => {
    //console.log('Edit button clicked for row id:', id);
    const enumValue = getEnumValueFromType(type);
    if (enumValue !== null) {
      openEditModal(id, customer, enumValue, true);
    } else {
      // Handle invalid type
      console.error('Invalid type:', type);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', sortable: false, width: 400 },
    { field: 'createdDate', headerName: 'Creation Date', width: 300 },
    { field: 'createdByUsername', headerName: 'Created By', sortable: false, width: 200 },
    { field: 'type', headerName: 'Order Type', width: 200 },
    { field: 'customerName', headerName: 'Customer', sortable: false, width: 200 },
    {
      field: 'edit',
      headerName: '',
      sortable: false,
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          color="primary"
          onClick={() => handleEdit(params.row.id, params.row.customerName, params.row.type)}
          sx={{
            opacity: 0.5,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[10]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
        onRowSelectionModelChange={changeSelection}
        apiRef={apiRef}
        sx={{
          minHeight: '600px',
          '&, [class^=MuiDataGrid]': {
            border: 'none'
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:focus': {
            outline: 'none',
          },
        }}
      />
    </div>
  );
};

export default DisplayTable;
