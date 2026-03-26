import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Articles from './pages/Articles.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import CreateArticle from './pages/CreateArticle.jsx';
import Categories from './pages/Categories.jsx';
import Users from './pages/Users.jsx';
import ViewUser from './pages/ViewUser.jsx';
import CreateUser from './pages/CreateUser.jsx';
import ConfirmEmailPage from './pages/ConfirmEmailPage.jsx';
import EditUser from './pages/EditUser.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/create"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/:slug"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/:slug/edit"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          {/* Routes Users */}
          {/* A créer après : CreateUser & EditUser */}
          <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute><ViewUser /></ProtectedRoute>} />
          <Route path="/admin/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/admin/users/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/admin/users/:id/edit" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
            
          {/* Redirect root to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
