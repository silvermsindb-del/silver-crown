import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGlobalData = async () => {
        try {
            setLoading(true);
            // Fetch global data with depth to include relations
            const response = await api.get('/globals/global-data?depth=2');
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch global data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if data is not already present (caching mechanism)
        if (!data) {
            fetchGlobalData();
        }
    }, []); // Empty dependency array ensures it runs once on mount

    return (
        <GlobalContext.Provider value={{ data, loading, error, refetch: fetchGlobalData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalData = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalData must be used within a GlobalProvider');
    }
    return context;
};
