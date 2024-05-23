import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'Order ID', sortable: false, width: 250 },
    { field: 'creationDate', headerName: 'Creation Date', width: 220 },
    { field: 'createdBy', headerName: 'Created By', sortable: false, width: 180 },
    {
      field: 'orderType',
      headerName: 'Order Type',
      width: 175,
    },
    {
      field: 'customer',
      headerName: 'Customer',
      sortable: false,
      width: 175,
    },
  ];

  const rows = [
    { id: 1, creationDate: 'sdfs', createdBy: "abhi", orderType: "Standard", customer: "Kroger"},
    
  ];

  export default function DisplayTable() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    );
  }