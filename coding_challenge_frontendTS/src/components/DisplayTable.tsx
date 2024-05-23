import { DataGrid, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import { Order } from './ParentComponent';

const columns = [
  { field: 'id', headerName: 'Order ID', sortable: false, width: 300 },
  { field: 'createdDate', headerName: 'Creation Date', width: 220 },
  { field: 'createdByUsername', headerName: 'Created By', sortable: false, width: 180 },
  { field: 'type', headerName: 'Order Type', width: 175 },
  { field: 'customerName', headerName: 'Customer', sortable: false, width: 175 },
];


interface DisplayTableProps {
  data: Order[];
  changeSelection: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}

export default function DisplayTable({ data, changeSelection }: DisplayTableProps) {
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
}
