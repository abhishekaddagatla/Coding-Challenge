import { useState, useEffect } from 'react';
import { TextField, InputAdornment } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface SearchbarProps {
    fetchAllData: () => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

export default function Searchbar({ fetchAllData, searchTerm, setSearchTerm }: SearchbarProps) {

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: 400, height: "100%" }}>
            <TextField
                size="small"
                label="Search"
                variant="outlined"
                fullWidth
                sx={{ bgcolor: 'transparent', mr: 1 }}
                value={searchTerm} // Controlled component: value is set to searchTerm
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on change
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">

                            <SearchIcon />

                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}
