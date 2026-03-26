import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService.js';
import AdminLayout from '../components/AdminLayout.jsx';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteCategory = async (slug) => {
          if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
  
          try {
              await categoryService.delete(slug);
              // Mettre à jour la liste localement
              setCategories(categories.filter(c => c.slug !== slug));
          } catch (err) {
              alert('Erreur lors de la suppression');
          }
      };

  if (loading) return <AdminLayout><div>Chargement...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ color: 'red' }}>{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Catégories</h2>
          <button style={styles.btn} onClick={() => navigate('/admin/categories/create')}>+ Nouvelle catégorie</button>
        </div>

        {categories.length === 0 ? (
          <p>Aucune catégorie</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.idCategory}>
                  <td>{cat.title}</td>
                  <td>{cat.slug}</td>
                  <td>
                    <button
                      style={{ ...styles.btnSmall, background: '#2ecc71' }}
                      onClick={() => navigate(`/admin/categories/${cat.slug}`)}
                    > Voir
                    </button>
                    <button
                      style={{ ...styles.btnSmall, background: '#3498db' }}
                      onClick={() => navigate(`/admin/categories/${cat.slug}/edit`)}
                    >Éditer</button>
                    <button style={{ ...styles.btnSmall, background: '#e74c3c' }}
                      onClick={() => handleDeleteCategory(cat.slug)}
                    >Supprimer</button>
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
  // btn: {
  //   backgroundColor: '#27ae60',
  //   color: 'white',
  //   padding: '10px 20px',
  //   border: 'none',
  //   borderRadius: '4px',
  //   cursor: 'pointer',
  // },
  btnSmall: {
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default Categories;
