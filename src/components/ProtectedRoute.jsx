import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

   // Vérification du rôle
  if (requiredRole && (!user || user.role.toUpperCase() !== requiredRole.toUpperCase())) {
    console.log("Accès refusé : rôle requis", requiredRole, "rôle actuel", user?.role);
    return <Navigate to="/403" />;
  }

  return children;
};
