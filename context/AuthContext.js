import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user_data');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
  };

  // 👇 THIS IS THE CRITICAL LOGOUT FUNCTION
  
  const logout = async () => {
    try {
      setUser(null); // Clears React state immediately
      await AsyncStorage.removeItem('@user_data'); // Clears the saved session
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);