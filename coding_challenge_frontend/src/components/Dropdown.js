import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';
import * as React from 'react';

export default function Dropdown() {
    const [type, setType] = React.useState('')

    const handleChange = (event) => {
        setType(event.target.value);
    }

    return (
      <FormControl variant="standard" sx={{ minWidth: 150, height: "100%" }}>
          <InputLabel id="demo-simple-select-standard-label">Order Type</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={type}
            onChange={handleChange}
            label="Order Type"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value={0}>Standard</MenuItem>
            <MenuItem value={1}>SaleOrder</MenuItem>
            <MenuItem value={2}>PurchaseOrder</MenuItem>
            <MenuItem value={3}>TransferOrder</MenuItem>
            <MenuItem value={4}>ReturnOrder</MenuItem>
          </Select>
        </FormControl>
    )
  }