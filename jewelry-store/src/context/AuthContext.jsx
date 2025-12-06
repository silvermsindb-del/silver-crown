import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getMe, registerUser } from '@/services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getMe()
                .then(res => setUser(res.user))
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        }
        return data;
    };

    const register = async (email, password, name) => {
        const data = await registerUser({ email, password, name, role: 'user' });
        // Auto login after register? Or just return data?
        // Usually good to auto login or let them login. 
        // For now, let's just return and let the component redirect.
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false); // Ensure loading is false after logout
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
