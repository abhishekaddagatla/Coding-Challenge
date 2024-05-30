import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from "react-router-dom";
import { useSession } from '../SessionContext';
import Button from '@mui/material/Button';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

export default function App() {
    const { session, supabase } = useSession();
    const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in');

    const toggleAuthMode = () => {
        setAuthMode((prev) => prev === 'sign_in' ? 'sign_up' : 'sign_in');
    };

    const headerText = authMode === 'sign_in' ? 'Sign In' : 'Sign Up';

    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/main');
        }
    }, [session, navigate]);

    if (!session) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline>
                    <Container maxWidth="sm" sx={{ mt: 3 }}>
                        <div style={
                            {
                                marginTop: '250px',
                            }

                        }>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <h1 style={{ marginBottom: 0 }}>{headerText}</h1>
                            </div>
                            <div>
                                <Auth
                                    supabaseClient={supabase}
                                    appearance={{
                                        theme: ThemeSupa,
                                        variables: {
                                            default: {
                                                colors: {
                                                    brand: '#57709e',
                                                    brandAccent: '#3c4e6e',
                                                    inputText: "white"
                                                },

                                            },
                                        },

                                    }}
                                    providers={[]}
                                    view={authMode}
                                    showLinks={false}
                                    additionalData={(e: any) => console.log("additionalData", e)}
                                />
                                <Button variant="text" size="medium" onClick={toggleAuthMode}>{authMode === 'sign_up' ? "Already have an Account? Sign In" : "No account? Sign Up"}</Button>
                            </div>

                        </div>
                    </Container>
                </CssBaseline>
            </ThemeProvider>
        )
    }
}

