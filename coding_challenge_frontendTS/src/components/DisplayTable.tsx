import React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRenderCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Order } from './ParentComponent';

interface DisplayTableProps {
  data: Order[];
  changeSelection: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
  openEditModal: (OrderID: string, Customer: string, OrderType: number, isOpen: boolean) => void;
}

export enum EnumsOrdersOrderType {
  Standard = 'Standard',
  SalesOrder = 'Sales Order',
  PurchaseOrder = 'Purchase Order',
  TransferOrder = 'Transfer Order',
  ReturnOrder = 'Return Order'
}

const enumValues = [
  EnumsOrdersOrderType.Standard,
  EnumsOrdersOrderType.SalesOrder,
  EnumsOrdersOrderType.PurchaseOrder,
  EnumsOrdersOrderType.TransferOrder,
  EnumsOrdersOrderType.ReturnOrder
];

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

const DisplayTable: React.FC<DisplayTableProps> = ({ data, changeSelection, openEditModal }) => {
  const handleEdit = (id: string, customer: string, type: string) => {
    console.log('Edit button clicked for row id:', id);
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
        <Button variant="text" color="primary" onClick={() => handleEdit(params.row.id, params.row.customerName, params.row.type)}>
          <EditIcon />
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={changeSelection}
        sx={{ '&, [class^=MuiDataGrid]': { border: 'none' } }}
      />
    </div>
  );
};

export default DisplayTable;
