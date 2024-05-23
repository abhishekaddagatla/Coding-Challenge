import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'Order ID', sortable: false, width: 300 },
  { field: 'createdDate', headerName: 'Creation Date', width: 220 },
  { field: 'createdByUsername', headerName: 'Created By', sortable: false, width: 180 },
  { field: 'type', headerName: 'Order Type', width: 175 },
  { field: 'customerName', headerName: 'Customer', sortable: false, width: 175 },
];

export default function DisplayTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7298/api/Orders");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        setRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
