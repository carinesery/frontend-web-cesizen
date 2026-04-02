import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emotionService } from '../services/emotionService';
import AdminLayout from '../components/AdminLayout';
import { COLORS } from '../constants/themes';
import { LevelEmotionEnum } from '../schemas/emotionSchema';
import { formStyles } from '../styles/formStyles';

const ViewEmotion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ========== STATE ==========
    const [emotion, setEmotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // ========== CHARGEMENT DES DONNÉES ==========
    useEffect(() => {
        fetchEmotion();
    }, [id]);

    const fetchEmotion = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await emotionService.getById(id);
            setEmotion(data);
        } catch (err) {
            setError('Erreur lors du chargement de l\'émotion');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ========== ACTIONS ==========
    const handleDeleteEmotion = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette émotion ?')) return;

        try {
            setActionLoading(true);
            await emotionService.delete(id);
            navigate('/admin/emotions');
        } catch (err) {
            alert('Erreur lors de la suppression');
        } finally {
            setActionLoading(false);
        }
    };

    // ========== RENDER ==========
    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textLight }}>
                    Chargement...
                </div>
            </AdminLayout>
        );
    }

    if (error || !emotion) {
        return (
            <AdminLayout>
                <div style={formStyles.errorMessage}>
                    {error || 'Émotion non trouvée'}
                </div>
            </AdminLayout>
        );
    }

    const LevelLabels = {
        [LevelEmotionEnum.LEVEL_1]: "Principale (niveau 1)",
        [LevelEmotionEnum.LEVEL_2]: "Secondaire (niveau 2 = sentiment)"
    };

    return (
        <AdminLayout>
            <div style={formStyles.container}>
                {/* ===== EN-TÊTE ===== */}
                <div style={formStyles.formHeader}>
                    <h2 style={formStyles.formTitle}>Détails de l'émotion</h2>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/emotions')}
                        style={formStyles.backBtn}
                    >
                        ← Retour aux émotions
                    </button>
                </div>

                {/* ===== ERREUR ACTION ===== */}
                {error && (
                    <div style={formStyles.errorMessage}>{error}</div>
                )}

                {/* ===== CARD INFO ===== */}
                <div style={formStyles.form}>
                    <div style={formStyles.formGrid}>

                        {/* Titre */}
                        <div style={formStyles.formGroup}>
                            <label style={styles.sectionLabel}>Titre</label>
                            <p style={styles.value}>{emotion.title}</p>
                        </div>

                        {/* Niveau */}
                        <div style={formStyles.formGroup}>
                            <label style={styles.sectionLabel}>Niveau</label>
                            <p style={styles.value}>{LevelLabels[emotion.level]}</p>
                        </div>

                        {/* Émotion parente */}
                        <div style={formStyles.formGroup}>
                            <label style={styles.sectionLabel}>Émotion principale associée</label>
                            <p style={styles.value}>
                                {emotion.parentEmotion?.title || '-'}
                            </p>
                        </div>

                        {/* Icône */}
                        <div style={formStyles.formGroup}>
                            <label style={styles.sectionLabel}>Icône</label>
                            {emotion.iconUrl ? (
                                <img
                                    src={`http://localhost:3000${emotion.iconUrl}`}
                                    alt="Icône"
                                    style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '8px', marginTop: '4px' }}
                                />
                            ) : (
                                <p style={styles.value}>-</p>
                            )}
                        </div>

                        {/* Description (pleine largeur) */}
                        <div style={{ ...formStyles.formGroup, ...formStyles.fullWidth }}>
                            <label style={styles.sectionLabel}>Description</label>
                            <p style={styles.value}>{emotion.description || '-'}</p>
                        </div>

                        {/* Sous-émotions (pleine largeur) */}
                        {emotion.childEmotions && emotion.childEmotions.length > 0 && (
                            <div style={{ ...formStyles.formGroup, ...formStyles.fullWidth }}>
                                <label style={styles.sectionLabel}>Sous-émotions ({emotion.childEmotions.length})</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                                    {emotion.childEmotions.map((child) => (
                                        <span
                                            key={child.idEmotion}
                                            onClick={() => navigate(`/admin/emotions/${child.idEmotion}`)}
                                            style={styles.childBadge}
                                        >
                                            {child.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== ACTIONS ===== */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate(`/admin/emotions/${id}/edit`)}
                        style={styles.editBtn}
                    >
                        ✏️ Modifier
                    </button>

                    {emotion.childEmotions.length === 0 && (
                        <button
                            onClick={() => handleDeleteEmotion(id)}
                            disabled={actionLoading}
                            style={{
                                ...styles.deleteBtn,
                                cursor: actionLoading ? 'not-allowed' : 'pointer',
                                opacity: actionLoading ? 0.7 : 1,
                            }}
                        >
                            🗑️ Supprimer
                        </button>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

// ===== STYLES LOCAUX =====
const styles: Record<string, React.CSSProperties> = {
    sectionLabel: {
        fontSize: '11px',
        fontWeight: 600,
        color: COLORS.neutral.gray,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px',
    },
    value: {
        margin: 0,
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        color: COLORS.neutral.black,
        padding: '10px 14px',
        backgroundColor: '#F7F9FB',
        borderRadius: '8px',
        border: `1px solid ${COLORS.neutral.borderGray}`,
    },
    childBadge: {
        padding: '6px 14px',
        backgroundColor: COLORS.backgroundVisible,
        color: COLORS.accent,
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
    },
    editBtn: {
        padding: '12px 24px',
        backgroundColor: COLORS.backgroundVisible,
        color: COLORS.accent,
        border: 'none',
        borderRadius: '32px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
    },
    deleteBtn: {
        padding: '12px 24px',
        backgroundColor: COLORS.backgroundDelete,
        color: COLORS.delete,
        border: 'none',
        borderRadius: '32px',
        fontSize: '14px',
        fontWeight: 600,
    },
};

export default ViewEmotion;
