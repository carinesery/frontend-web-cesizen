import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService.js';
import AdminLayout from '../components/AdminLayout.jsx';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    status: 'DRAFT',
    categories: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Optionnel: upload image (pour l'instant, pas d'image)
      const payload = {
        ...formData,
        categories: formData.categories.length > 0 
          ? formData.categories.split(',').map(s => s.trim())
          : undefined,
      };

      await articleService.create(payload);
      navigate('/admin/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <button 
          onClick={() => navigate('/admin/articles')} 
          style={styles.backBtn}
        >
          ← Retour
        </button>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>Créer un nouvel article</h2>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label>Titre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Titre de l'article"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Résumé</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '80px' }}
              placeholder="Résumé court de l'article"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Contenu *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              style={{ ...styles.input, minHeight: '300px' }}
              placeholder="Contenu principal de l'article"
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label>Statut</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                style={styles.input}
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Catégories (séparées par des virgules)</label>
              <input
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                style={styles.input}
                placeholder="tech, lifestyle, education"
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button 
              type="button"
              onClick={() => navigate('/admin/articles')}
              style={{ ...styles.btn, background: '#95a5a6' }}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ ...styles.btn, background: '#27ae60' }}
            >
              {loading ? 'Création...' : '✓ Créer l\'article'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
  },
  backBtn: {
    backgroundColor: '#95a5a6',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '5px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #ddd',
  },
  btn: {
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default CreateArticle;
