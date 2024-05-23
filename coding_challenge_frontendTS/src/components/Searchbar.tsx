import { TextField, InputAdornment } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';

interface SearchbarProps {
    fetchSearchedData: (searchTerm: string) => void;
    fetchAllData: () => void;
}

export default function Searchbar({ fetchSearchedData, fetchAllData }: SearchbarProps) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = () => {
        if (searchTerm === '') {
            fetchAllData();
        } else {
            fetchSearchedData(searchTerm);
        }
    };

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
                            <IconButton type="button" sx={{ p: 0 }} aria-label="search" onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}
