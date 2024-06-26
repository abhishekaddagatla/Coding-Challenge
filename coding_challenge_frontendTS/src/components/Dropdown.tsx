import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';
import * as React from 'react';

interface DropdownProps {
  fetchAllData: (page: number, pageSize: number) => void;
  type: string;
  setType: (type: string) => void;
  page: number;
  pageSize: number;
}

export default function Dropdown({ fetchAllData, type, setType, page, pageSize }: DropdownProps) {

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    const selectedValue = event.target.value as string;
    setType(selectedValue);
    fetchAllData(page, pageSize);
  }

  return (
    <FormControl variant="standard" sx={{ minWidth: 150, height: "100%", mr: 2 }}>
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
        <MenuItem value={1}>Sale Order</MenuItem>
        <MenuItem value={2}>Purchase Order</MenuItem>
        <MenuItem value={3}>Transfer Order</MenuItem>
        <MenuItem value={4}>Return Order</MenuItem>
      </Select>
    </FormControl>
  )
}