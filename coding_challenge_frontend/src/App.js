import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import Dropdown from './components/Dropdown';
import Searchbar from './components/Searchbar';
import DisplayTable from './components/DisplayTable';
import BasicModal from './components/CreateOrderModal';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <Searchbar />
            <Button variant="outlined" sx={{ mr: 2, flexShrink: 0 }}>+ New Order</Button>
            <Button variant="outlined" sx={{ mr: 2, flexShrink: 0 }}>Delete Selected</Button>
            <Dropdown />
          </div>
          <div>
            <DisplayTable></DisplayTable>
            <BasicModal/>
          </div>
        </Container>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
