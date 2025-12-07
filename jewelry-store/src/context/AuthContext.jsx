import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getMe, registerUser, logoutUser } from '@/services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const res = await getMe();
            setUser(res.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        if (data.user) {
            setUser(data.user);
        }
        return data;
    };

    const register = async (email, password, name) => {
        const data = await registerUser({ email, password, name, role: 'user' });
        // After register, we might want to auto-login or redirect.
        // If the backend logs them in on register (returns cookie), we can setUser.
        if (data.user) {
            setUser(data.user);
        }
        return data;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Logout failed", e);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
