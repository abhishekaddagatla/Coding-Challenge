import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface SearchbarProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

export default function Searchbar({ searchTerm, setSearchTerm }: SearchbarProps) {

    return (
        <div style={{ display: 'flex', alignItems: 'end', width: 400, height: "100%", marginRight: '1rem' }}>
            <TextField
                size="small"
                label="Search"
                variant="outlined"
                fullWidth
                sx={{ bgcolor: 'transparent' }}
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
