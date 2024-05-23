import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import { Container } from '@mui/material';

import ParentComponent from './components/ParentComponent'

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
          <ParentComponent></ParentComponent>
        </Container>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App
