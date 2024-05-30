import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
    'https://bgjzrqctvozmutgbmgqy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnanpycWN0dm96bXV0Z2JtZ3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5OTI3NDksImV4cCI6MjAzMjU2ODc0OX0.l27E9ZWJ47ZIlhqLyC71mfQzOW3lvNda2GEm8pxpprY'
);

interface Profile {
    email: string;
}

interface SessionContextProps {
    session: Session | null;
    supabase: SupabaseClient;
    profile: Profile | null;
    signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    const fetchProfile = async (user: User) => {
        setProfile({ email: user.email || '' });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user);
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [session?.user.aud])

    // console.log("profile: ", profile, "session: ", session, "session.user: ", session?.user);


    return (
        <SessionContext.Provider value={{ session, supabase, profile, signOut }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
