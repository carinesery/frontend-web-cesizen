import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        <nav style={styles.nav}>
          <Link to="/admin" style={styles.navLink}>📊 Dashboard</Link>
          <Link to="/admin/articles" style={styles.navLink}>📄 Articles</Link>
          <Link to="/admin/categories" style={styles.navLink}>🏷️ Catégories</Link>
          <Link to="/admin/users" style={styles.navLink}>👥 Utilisateurs</Link>
          <Link to="/admin/emotions" style={styles.navLink}>😃 Émotions</Link>

        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Bienvenue, {user?.username || 'Admin'}</h1>
        </header>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    marginBottom: '30px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    paddingBottom: '15px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '12px',
    borderRadius: '4px',
    transition: 'background 0.3s',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: 'auto',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    borderBottom: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
};

export default AdminLayout;
