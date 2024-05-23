import { TextField, InputAdornment } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function Searchbar() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', width: 400, height: "100%" }}>
            <TextField 
                size="small" 
                label="Search" 
                variant="outlined" 
                fullWidth
                sx={{ bgcolor: 'transparent', mr: 1 }} // Remove background color from TextField
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton type="button" sx={{ p: 0 }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}
