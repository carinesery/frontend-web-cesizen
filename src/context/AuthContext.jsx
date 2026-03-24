import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer le token au chargement
  useEffect(() => {
    const storedToken = authService.getToken();
    if (storedToken) {
      setToken(storedToken);
      // Optionnel : récupérer les infos du user depuis l'API
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    setToken(response.accessToken);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
