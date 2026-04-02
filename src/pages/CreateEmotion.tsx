import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { createEmotionBodySchema } from '../schemas/emotionSchema';
import { emotionService } from '../services/emotionService';
import AdminLayout from '../components/AdminLayout';
import { LevelEmotionEnum } from '../schemas/emotionSchema';
import { formStyles, getInputStyle, getTextareaStyle, getFileInputStyle } from '../styles/formStyles';

const CreateEmotion = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [parentEmotions, setParentEmotions] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: LevelEmotionEnum.LEVEL_1,
        parentEmotionId: undefined,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    // ========== CHARGEMENT DES ÉMOTIONS POUR LE SELECT ========== //
    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const data = await emotionService.getAll();
                console.log("Toutes les émotions:", data);
                setParentEmotions(data
                    .filter(emotion => emotion.level === LevelEmotionEnum.LEVEL_1)
                    .map(emotion => ({ title: emotion.title, id: emotion.idEmotion })));
            } catch (error) {
                console.error('Erreur lors du chargement des émotions:', error);
            }
        };
        fetchEmotions();
    }, []);

    console.log("Voici mes émotions de niveau 1:", parentEmotions);

    // Les erreurs de validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Message de succès
    const [successMessage, setSuccessMessage] = useState('');



    // ========= VALIDATION SCHEMA ======== //

    // ========== VALIDATION ==========
    // Valide UN champ à la fois (quand tu quittes le champ - onBlur)
    const validateField = (name, value) => {
        try {
            // On crée un schéma partiel juste pour ce champ
            const fieldSchema = (createEmotionBodySchema as any).pick({ [name]: true });
            fieldSchema.parse({ [name]: value });


            // Si valide, enlever l'erreur pour ce champ
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        } catch (error) {
            console.log("ERREUR SUBMIT:", error);
            if (error instanceof z.ZodError) {
                // Ajouter le message d'erreur Zod
                setErrors(prev => ({
                    ...prev,
                    [name]: error.issues[0]?.message || 'Erreur de validation'
                }));
            }
        }
    };

    // ========== HANDLERS ========== //
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        console.log("formData", formData);
    };

    // Quand tu quittes un input (validation en temps réel)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    // Quand tu sélectionnes un fichier image
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vérifier que c'est une image
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    iconUrl: 'Seules les images sont acceptées'
                }));
                setSelectedFile(null);
                return;
            }

            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    iconUrl: 'Le fichier est trop volumineux (max 5MB)'
                }));
                setSelectedFile(null);
                return;
            }

            // OK, on sauvegarde le fichier
            setSelectedFile(file);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.iconUrl;
                return newErrors;
            });
        }
    };


    // ========== SUBMISSION ========== //
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        try {

            setLoading(true);

            const validatedData = createEmotionBodySchema.parse(formData);
            setErrors({});

            const formDataToSend = new FormData();
            formDataToSend.append('title', validatedData.title);
            formDataToSend.append('description', validatedData.description);
            formDataToSend.append('level', validatedData.level || LevelEmotionEnum.LEVEL_1);


            if (validatedData.parentEmotionId) {
                formDataToSend.append('parentEmotionId', validatedData.parentEmotionId);
            }

            if (selectedFile) {
                formDataToSend.append('iconUrl', selectedFile);
            }

            // 3. Appeler le service backend
            const newEmotion = await emotionService.create(formDataToSend);

            // 4. Afficher succès
            setLoading(false);
            setSuccessMessage(`✅ Émotion ${newEmotion.title} créée avec succès !`);

            // 5. Réinitialiser le formulaire
            setFormData({
                title: '',
                description: '',
                level: LevelEmotionEnum.LEVEL_1,
                parentEmotionId: undefined,
            });
            setSelectedFile(null);

            // 6. Rediriger après 2 secondes
            setTimeout(() => {
                navigate('/admin/emotions');
            }, 2000);

        } catch (error) {
            if (error instanceof z.ZodError) {
                const zodErrors = {};
                error.issues.forEach(err => {
                    const fieldName = err.path?.[0];
                    if (fieldName && !zodErrors[fieldName]) zodErrors[fieldName] = err.message;
                });
                setErrors(zodErrors);
            } else if (error?.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else {
                setErrors({ submit: error.message || 'Erreur inconnue' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div style={formStyles.container}>
                <div style={formStyles.formHeader}>
                    <h2 style={formStyles.formTitle}>Créer une nouvelle émotion</h2>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/emotions')}
                        style={formStyles.backBtn}
                    >
                        ← Retour aux émotions
                    </button>
                </div>

                {successMessage && (
                    <div style={formStyles.successMessage}>
                        {successMessage}
                    </div>
                )}
                {errors.submit && (
                    <div style={formStyles.errorMessage}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={formStyles.form}>
                  <div style={formStyles.formGrid}>
                    {error && <div style={{ ...formStyles.errorMessage, ...formStyles.fullWidth }}>{error}</div>}

                    {/* ===== TITRE + NIVEAU ===== */}
                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label}>Titre *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={getInputStyle(false)}
                            onBlur={handleBlur}
                            placeholder="Titre de l'émotion"
                        />
                    </div>

                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label}>Niveau</label>
                        <select 
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            style={formStyles.select}
                            onBlur={handleBlur}
                        >
                            <option value={LevelEmotionEnum.LEVEL_1}>Emotion principale</option>
                            <option value={LevelEmotionEnum.LEVEL_2}>Emotion secondaire (sentiment)</option>
                        </select>
                    </div>

                    {/* ===== ÉMOTION PARENTE + ICÔNE ===== */}
                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label}>Émotion parente</label>
                        <select disabled={formData.level === LevelEmotionEnum.LEVEL_1}
                            name="parentEmotionId"
                            value={formData.parentEmotionId}
                            onChange={handleChange}
                            style={formStyles.select}
                            onBlur={handleBlur}
                        >
                            <option value="">-- Choisir une émotion parente --</option>
                            {parentEmotions.map(emotion => (
                                <option key={emotion.id} value={emotion.id}>
                                    {emotion.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label} htmlFor="iconUrl">Icône (optionnelle)</label>
                        <input
                            id="iconUrl"
                            type="file"
                            name="iconUrl"
                            onChange={handleFileChange}
                            accept="image/*"
                            style={getFileInputStyle(!!errors.iconUrl)}
                        />
                        {selectedFile && (
                            <small style={formStyles.fileSuccess}>
                                ✅ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)}KB)
                            </small>
                        )}
                        {errors.iconUrl && (
                            <span style={formStyles.fieldError}>
                                {errors.iconUrl}
                            </span>
                        )}
                    </div>

                    {/* ===== DESCRIPTION (pleine largeur) ===== */}
                    <div style={{ ...formStyles.formGroup, ...formStyles.fullWidth }}>
                        <label style={formStyles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={getTextareaStyle(false, '80px')}
                            onBlur={handleBlur}
                            placeholder="Décrivez l'émotion ici"
                        />
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div style={formStyles.actions}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/emotions')}
                            style={formStyles.cancelBtn}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? formStyles.confirmBtnDisabled : formStyles.confirmBtn}
                        >
                            {loading ? 'Création...' : 'Créer l\'émotion'}
                        </button>
                    </div>
                  </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CreateEmotion;
