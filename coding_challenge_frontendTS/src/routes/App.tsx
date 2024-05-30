import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import { Container } from '@mui/material';
import { useSession } from '../SessionContext';
import { useNavigate } from 'react-router-dom';
import ParentComponent from '../components/ParentComponent'
import { useEffect, useState } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const App: React.FC = () => {
  const { session, profile } = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme(theme.palette.mode === 'dark' ? lightTheme : darkTheme);
  }

  useEffect(() => {
    // Redirect to login if session is not available
    if (!session) {
      navigate('/');
    }

    // Redirect to main page once both session and profile are fetched
    if (session && profile && isLoading) {
      navigate('/main');
      setIsLoading(false); // Set loading state to false to prevent repeated redirects
    }
  }, [session, profile, navigate, isLoading]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <ParentComponent toggleTheme={toggleTheme} theme={theme} />
        </Container>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App
