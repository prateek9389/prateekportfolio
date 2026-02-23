import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        // Set a timeout as a fail-safe in case Firebase fails to initialize or respond
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth check timed out. Proceeding to render.");
                setLoading(false);
            }
        }, 3000);

        try {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
                clearTimeout(timeout);
            });
            return () => {
                unsubscribe();
                clearTimeout(timeout);
            };
        } catch (error) {
            console.error("Firebase Auth initialization error:", error);
            setLoading(false);
            clearTimeout(timeout);
        }
    }, [loading]);

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
