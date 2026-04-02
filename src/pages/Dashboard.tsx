import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { COLORS } from '../constants/themes';
import { articleService } from '../services/articleService';
import { categoryService } from '../services/categoryService';
import { userService } from '../services/userService';
import { emotionService } from '../services/emotionService';
import { IoDocumentTextOutline, IoBookmarksOutline, IoPeopleOutline, IoHappyOutline } from 'react-icons/io5';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    users: 0,
    emotionsL1: 0,
    emotionsL2: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articles, categories, users, emotions] = await Promise.all([
          articleService.getAll(),
          categoryService.getAll(),
          userService.getAll(),
          emotionService.getAll(),
        ]);

        setStats({
          articles: articles.length,
          categories: categories.length,
          users: users.length,
          emotionsL1: emotions.filter((e: any) => e.level === 'LEVEL_1').length,
          emotionsL2: emotions.filter((e: any) => e.level === 'LEVEL_2').length,
        });
      } catch (err) {
        console.error('Erreur chargement stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Articles',
      value: stats.articles,
      icon: <IoDocumentTextOutline size={28} color={COLORS.primary} />,
      bg: COLORS.softAqua,
      border: COLORS.secondary,
    },
    {
      label: 'Catégories',
      value: stats.categories,
      icon: <IoBookmarksOutline size={28} color={COLORS.accent} />,
      bg: COLORS.softViolet,
      border: COLORS.backgroundVisible,
    },
    {
      label: 'Utilisateurs',
      value: stats.users,
      icon: <IoPeopleOutline size={28} color={COLORS.primary} />,
      bg: COLORS.softAqua,
      border: COLORS.secondary,
    },
    {
      label: 'Émotions',
      value: null, // custom render
      icon: <IoHappyOutline size={28} color={COLORS.accent} />,
      bg: COLORS.softViolet,
      border: COLORS.backgroundVisible,
    },
  ];

  return (
    <AdminLayout>
      <div style={styles.container}>
        {/* Bienvenue */}
        <h2 style={styles.welcomeText}>Bienvenue, {user?.username || 'Admin'} 👋</h2>

        {/* Cartes statistiques */}
        <div style={styles.cardsRow}>
          {cards.map((card, i) => (
            <div key={i} style={{ ...styles.card, backgroundColor: card.bg, borderColor: card.border }}>
              <div style={styles.cardIcon}>{card.icon}</div>
              <div style={styles.cardBody}>
                {card.label === 'Émotions' ? (
                  <div style={styles.emotionValues}>
                    <span style={styles.cardValue}>{stats.emotionsL1}</span>
                    <span style={styles.emotionSeparator}>/</span>
                    <span style={styles.cardValue}>{stats.emotionsL2}</span>
                  </div>
                ) : (
                  <span style={styles.cardValue}>{loading ? '–' : card.value}</span>
                )}
                {card.label === 'Émotions' ? (
                  <div style={styles.emotionLabels}>
                    <span style={styles.emotionLabel}>Niveau 1</span>
                    <span style={styles.emotionLabel}>Niveau 2</span>
                  </div>
                ) : (
                  <span style={styles.cardLabel}>{card.label}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Citation inspirante */}
        <div style={styles.quoteSection}>
          <p style={styles.quoteText}>
            « Chaque jour est une nouvelle chance de devenir la meilleure version de soi-même. »
          </p>
          <span style={styles.quoteAuthor}>— Anonyme</span>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '16px 24px',
    height: '100%',
    alignItems: 'center',
    gap: '6rem', 
  },

  welcomeText: {
    fontSize: '28px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    color: COLORS.accent,
    margin: 0,
    alignSelf: 'flex-start',
  },

  // Citation
  quoteSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '0 40px',
  },
  quoteText: {
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
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

  // Cartes
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 190px)',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '22px 16px',
    borderRadius: '14px',
    border: '1.5px solid',
    aspectRatio: '1 / 1',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  cardValue: {
    fontSize: '28px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    color: COLORS.text,
    lineHeight: 1,
  },
  cardLabel: {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    color: COLORS.neutral.gray,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  // Émotions double
  emotionValues: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  emotionSeparator: {
    fontSize: '24px',
    fontWeight: 300,
    color: COLORS.neutral.gray,
  },
  emotionLabels: {
    display: 'flex',
    gap: '16px',
  },
  emotionLabel: {
    fontSize: '11px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    color: COLORS.neutral.gray,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
};

export default Dashboard;
