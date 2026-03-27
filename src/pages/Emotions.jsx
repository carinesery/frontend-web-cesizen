import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emotionService } from '../services/emotionService.js';
import AdminLayout from '../components/AdminLayout.jsx';
import { LevelEmotionEnum } from '../schemas/emotionSchema.js';

const Emotions = () => {
  const [emotions, setEmotions] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      setLoading(true);
      const data = await emotionService.getAll();
      setEmotions(data);
    } catch (err) {
      setError('Erreur lors du chargement des émotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteEmotion = async (id) => {
          if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette émotion ?')) return;
  
          try {
              await emotionService.delete(id);
              // Mettre à jour la liste localement
              setEmotions(emotions.filter(e => e.idEmotion !== id));
          } catch (err) {
              alert('Erreur lors de la suppression');
          }
      };

  if (loading) return <AdminLayout><div>Chargement...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ color: 'red' }}>{error}</div></AdminLayout>;

  const LevelLabels = {
    [LevelEmotionEnum.LEVEL_1]: 1,
    [LevelEmotionEnum.LEVEL_2]: 2,
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Emotions</h2>
          <button style={styles.btn} onClick={() => navigate('/admin/emotions/create')}>+ Nouvelle émotion</button>
        </div>

        {emotions.length === 0 ? (
          <p>Aucune émotion</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Niveau</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emotions.map((emotion) => (
                <tr key={emotion.idEmotion}>
                  <td>{emotion.title}</td>
                  <td>{emotion.description}</td>
                  <td>{LevelLabels[emotion.level]}</td>
                  <td>
                    <button
                      style={{ ...styles.btnSmall, background: '#2ecc71' }}
                      onClick={() => navigate(`/admin/emotions/${emotion.idEmotion}`)}
                    > Voir
                    </button>
                    <button
                      style={{ ...styles.btnSmall, background: '#3498db' }}
                      onClick={() => navigate(`/admin/emotions/${emotion.idEmotion}/edit`)}
                    >Éditer</button>
                    <button style={{ ...styles.btnSmall, background: '#e74c3c' }}
                      onClick={() => handleDeleteEmotion(emotion.idEmotion)}
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

export default Emotions;
