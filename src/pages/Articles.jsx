import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService.js';
import AdminLayout from '../components/AdminLayout.jsx';

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getAll();
      setArticles(data);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    try {
      await articleService.delete(slug);
      setArticles(articles.filter(a => a.slug !== slug));
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  if (loading) return <AdminLayout><div>Chargement...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ color: 'red' }}>{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Articles</h2>
          <button 
            onClick={() => navigate('/admin/articles/create')}
            style={styles.btn}
          >
            + Nouvel article
          </button>
        </div>

        {articles.length === 0 ? (
          <p>Aucun article</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Slug</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.idArticle}>
                  <td>{article.title}</td>
                  <td>{article.slug}</td>
                  <td>{article.status}</td>
                  <td style={styles.actions}>
                    <button 
                      onClick={() => navigate(`/admin/articles/${article.slug}`)}
                      style={{ ...styles.btnSmall, background: '#3498db' }}
                    >
                      👁️ Voir
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/articles/${article.slug}/edit`)}
                      style={{ ...styles.btnSmall, background: '#f39c12' }}
                    >
                      ✏️ Éditer
                    </button>
                    <button 
                      onClick={() => handleDelete(article.slug)}
                      style={{ ...styles.btnSmall, background: '#e74c3c' }}
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  btn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnSmall: {
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px',
  },
  actions: {
    display: 'flex',
    gap: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default Articles;
