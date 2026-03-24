import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
