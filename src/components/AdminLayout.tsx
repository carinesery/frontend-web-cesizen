import React from 'react';
import { useContext, ReactNode, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { COLORS, SPACING } from '../constants/themes';
import { IoDocumentTextOutline, IoBookmarksOutline, IoHappyOutline, IoPeopleOutline, IoStatsChartOutline, IoLogOutOutline } from 'react-icons/io5';
import logoCesizen from '../assets/images/logo-cesizen-fond-moyen.png';
import lotusViolet from '../assets/images/lotus-violet.png';
import logoMinistere from '../assets/images/logo-ministere-sante.png';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const { pathname } = useLocation();
  const isActive = to === '/admin' ? pathname === '/admin' : pathname.startsWith(to);

  return (
    <Link to={to} style={{ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) }}>
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { style: { ...((icon as any).props?.style || {}), color: isActive ? COLORS.primary : COLORS.neutral.black } })
        : icon}
      {label}
    </Link>
  );
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ZenQuotes désactivé temporairement (CORS)
  // const [quote, setQuote] = useState('');
  // const [quoteAuthor, setQuoteAuthor] = useState('');
  // useEffect(() => {
  //   const fetchQuote = async () => {
  //     try {
  //       const res = await fetch('/api/zenquotes/random');
  //       const data = await res.json();
  //       const q = Array.isArray(data) ? data[0] : data;
  //       if (!q?.q) return;
  //       const translation = await fetch(
  //         `/api/mymemory/get?q=${encodeURIComponent(q.q)}&langpair=en|fr`
  //       );
  //       const transData = await translation.json();
  //       setQuote(transData.responseData.translatedText);
  //       setQuoteAuthor(q.a);
  //     } catch (err) {
  //       console.error('Erreur citation:', err);
  //     }
  //   };
  //   fetchQuote();
  // }, []);

  // Citation déplacée dans le Dashboard
  // const quote = ...
  // const quoteAuthor = ...

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        {/* <span style={styles.separator}></span> */}
        <div style={styles.quoteSection}>
          <p style={styles.quoteText}>
            « Chaque jour est une nouvelle chance de devenir la meilleure version de soi-même. »
          </p>
          <span style={styles.quoteAuthor}>— Anonyme</span>
        </div>
        {/* <h2 style={styles.welcomeText}>Bienvenue, {user?.username || 'Admin'} !</h2> */}
      </header>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logoCesizen} alt="Logo Cesizen" style={styles.logo} />
          <div style={styles.containerTitle}>
            <h1 style={styles.brand}>CESIZen</h1>
            <h2 style={styles.subtitle}>Administration</h2>
          </div>
        </div>
        <nav style={styles.nav}>
          <NavItem to="/admin" icon={<IoStatsChartOutline size={20} />} label="Dashboard" />
          <NavItem to="/admin/articles" icon={<IoDocumentTextOutline size={20} />} label="Articles" />
          <NavItem to="/admin/categories" icon={<IoBookmarksOutline size={20} />} label="Catégories" />
          <NavItem to="/admin/users" icon={<IoPeopleOutline size={20} />} label="Utilisateurs" />
          <NavItem to="/admin/emotions" icon={<IoHappyOutline size={20} />} label="Émotions" />
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <IoLogOutOutline size={18} />
          Déconnexion
        </button>
        <div style={styles.sidebarFooter}>
          <span style={styles.footerText}>Une application propulsée par</span>
          <img src={logoMinistere} alt="Ministère de la Santé / Santé publique France" style={styles.footerLogo} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>

        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gridTemplateRows: '156px 1fr',
    gridTemplateAreas: `
      "aside header"
      "aside main"
    `,
    height: '100vh',
    // backgroundColor: COLORS.neutral.white,
    background: `linear-gradient(to bottom, ${COLORS.softAqua}, ${COLORS.softViolet})`,
  },
  // Citation
  quoteSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    padding: '0 40px',
  },
  quoteText: {
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontStyle: 'italic',
    color: COLORS.primary,
    lineHeight: 1.6,
    margin: 0,
    textAlign: 'center' as const,
  },
  quoteAuthor: {
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontStyle: 'normal',
    color: COLORS.accent,
  },

  sidebar: {
    gridArea: 'aside',
    width: '320px',
    // background: `linear-gradient(to bottom, ${COLORS.softAqua}, ${COLORS.softViolet})`,
    color: 'white',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '32px 16px',
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    // border: `1px solid red`,  
    height: '132px',
  },
  sidebarTitle: {
    color: COLORS.primary,
    margin: 0,
  },
  logo: {
    width: '80px',
  },
  containerTitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    gap: SPACING.xs,
  },
  brand: {
    color: COLORS.primary,
    fontFamily: 'Just Sans',
    fontWeight: 'bold',
    fontSize: '24px',
    margin: '0',
  },
  subtitle: {
    color: COLORS.primary,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '16px',
    margin: '0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${SPACING.sm}px`,
    flex: 1,
    paddingTop: SPACING.xl,
  },
  navLink: {
    textDecoration: 'none',
    color: COLORS.neutral.black,
    display: 'flex',
    alignItems: 'center',
    gap: `${SPACING.sm}px`,
    padding: `${SPACING.md + 2}px ${SPACING.md}px`,
    borderRadius: `${SPACING.sm}px`,
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background-color 0.2s',
  },
  navLinkActive: {
    backgroundColor: COLORS.backgroundVisible,
    color: COLORS.primary,
    fontWeight: 600,
  },
  logoutBtn: {
    backgroundColor: COLORS.backgroundDelete,
    color: COLORS.delete,
    border: `1px solid ${COLORS.delete}`,
    padding: `${SPACING.md + 2}px ${SPACING.md}px`,
    borderRadius: `${SPACING.sm}px`,
    cursor: 'pointer',
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${SPACING.sm}px`,
    fontSize: '14px',
    fontWeight: 600,
    width: '100%',
    transition: 'background-color 0.2s',
  },
  sidebarFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '16px',
    marginTop: '16px',
    borderTop: `1px solid ${COLORS.neutral.borderGray}`,
  },
  footerText: {
    fontSize: '11px',
    color: COLORS.neutral.gray,
    fontWeight: 400,
  },
  footerLogo: {
    width: '90px',
    objectFit: 'contain',
  },
  main: {
    gridArea: 'main',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    //  borderRadius: '24px 0 0 0',
  },
  header: {
    gridArea: 'header',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 48px',
    position: 'relative',
    // backgroundColor: COLORS.backgroundVisible,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeText: {
    display: 'flex',
    fontSize: '32px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    color: COLORS.neutral.black,
    justifySelf: 'flex-start',
    // margin: 0,
    // alignSelf: 'flex-start',
  },
  // separator: {
  //   display: 'inline-block',
  //   width: '4px',
  //   height: '96px',
  //   backgroundColor: COLORS.aqua,
  //   borderRadius: '2px',
  //   marginRight: '16px',
  //   position: 'absolute',
  //   left: '0px',
  //   top: '50%',
  //   transform: 'translateY(-50%)',
  // }
};

export default AdminLayout;
