import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setUserLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        })

        return () => subscription.unsubscribe();
    }, [])

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
    } 

    return <AuthContext.Provider value={{ user, userLoading, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);