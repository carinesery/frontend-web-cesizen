import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { categoryService } from '../services/categoryService';
import AdminLayout from '../components/AdminLayout';
import { IoPencilSharp } from 'react-icons/io5';
import { updateCategoryBodySchema } from '../schemas/categorySchema';
import { formStyles, getInputStyle, getTextareaStyle, getFileInputStyle } from '../styles/formStyles';

const EditCategory = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [removePicture, setRemovePicture] = useState(false);

    // ========== STATE ==========
    const [loading, setLoading] = useState(false);

    // Les données du formulaire + image
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        iconUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Les erreurs de validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Message de succès
    const [successMessage, setSuccessMessage] = useState('');

    // Fonction pour vérifier s'il y a des changements dans le formulaire
    const hasChanges = () => {
        if (!initialData) return false;

        return (
            formData.title !== initialData.title ||
            formData.description !== initialData.description ||
            selectedFile !== null ||
            removePicture // si l'utilisateur a choisi de supprimer la photo
        );
    };

    // ========== EFFECTS ==========
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await categoryService.getBySlug(slug);
                setFormData({
                    title: data.title,
                    description: data.description,
                    iconUrl: data.iconUrl
                });

                setInitialData({
                    title: data.title,
                    description: data.description,
                    iconUrl: data.iconUrl
                });

            } catch (err) {
                console.error('Erreur lors du chargement de la catégorie', err);
            }
        };

        fetchCategory();
    }, [slug]);


    // ========== VALIDATION ==========
    // Valide UN champ à la fois (quand tu quittes le champ - onBlur)
    const validateField = (name, value) => {
        try {
            // On crée un schéma partiel juste pour ce champ
            const fieldSchema = (updateCategoryBodySchema as any).pick({ [name]: true });
            fieldSchema.parse({ [name]: value });


            // Si valide, enlever l'erreur pour ce champ
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Ajouter le message d'erreur Zod
                setErrors(prev => ({
                    ...prev,
                    [name]: error.issues[0]?.message || 'Erreur de validation'
                }));
            }
        }
    };

    // ========== HANDLERS ==========
    // Quand tu tapes dans un input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                    profilPicture: 'Seules les images sont acceptées'
                }));
                setSelectedFile(null);
                return;
            }

            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    profilPicture: 'Le fichier est trop volumineux (max 5MB)'
                }));
                setSelectedFile(null);
                return;
            }

            // OK, on sauvegarde le fichier
            setSelectedFile(file);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.profilPicture;
                return newErrors;
            });
        }
    };

    // ========== SUBMISSION ==========
    // Quand tu cliques "Créer une catégorie"
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        try {
            // 1. Valider TOUT le formulaire avec Zod
            const validatedData = updateCategoryBodySchema.parse(formData);
            setErrors({});

            setLoading(true);

            // 2. Créer FormData pour envoyer fichier + données
            const formDataToSend = new FormData();
            formDataToSend.append('title', validatedData.title);
            formDataToSend.append('description', validatedData.description);

            if (selectedFile) {
                formDataToSend.append('iconUrl', selectedFile);
            }

            if (validatedData.removeIcon) {
                formDataToSend.append('removeIcon', 'true');
                setRemovePicture(true); // reset du state
            }

            if (!hasChanges()) {
                setErrors({ submit: 'Aucune modification détectée' });
                return;
            }

            // 3. Appeler le service backend vérifier qu'il renvoie updatedCtageory
            const updatedCategory = await categoryService.update(slug, formDataToSend);

            // 4. Afficher succès
            setSuccessMessage(`✅ Catégorie ${updatedCategory.title} mise à jour avec succès !`);

            // 5. Réinitialiser le formulaire
            setFormData({
                title: '',
                description: '',
                iconUrl: ''
            });
            setSelectedFile(null);

            // 6. Rediriger après 2 secondes
            setTimeout(() => {
                navigate('/admin/categories');
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

    // ========== RENDER ==========
    return (
        <AdminLayout>
            <div style={formStyles.container}>
                <div style={formStyles.formHeader}>
                    <h2 style={formStyles.formTitle}>Modifier une catégorie</h2>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/categories')}
                        style={formStyles.backBtn}
                    >
                        ← Retour aux catégories
                    </button>
                </div>

                {/* Message de succès */}
                {successMessage && (
                    <div style={formStyles.successMessage}>
                        {successMessage}
                    </div>
                )}

                {/* Message d'erreur serveur */}
                {errors.submit && (
                    <div style={formStyles.errorMessage}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={formStyles.form}>
                  <div style={formStyles.formGrid}>
                    {/* ===== TITLE + ICON ===== */}
                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label} htmlFor="title">Titre</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Min 1 caractère"
                            style={getInputStyle(!!errors.title)}
                        />
                        {errors.title && (
                            <span style={formStyles.fieldError}>
                                {errors.title}
                            </span>
                        )}
                    </div>

                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label} htmlFor="icon">Icône de la catégorie (optionnel)</label>
                        <input
                            id="icon"
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
                        {formData.iconUrl && !selectedFile && (
                            <div style={formStyles.imagePreview}>
                                <img src={`http://localhost:3000${formData.iconUrl}`} width="100" style={{ borderRadius: '8px' }} />
                                <button type="button"
                                    style={formStyles.deleteImageBtn}
                                    onClick={() => {
                                        setRemovePicture(true);
                                        setSelectedFile(null);
                                        setFormData(prev => ({ ...prev, iconUrl: null }));
                                    }}
                                >
                                    Supprimer la photo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ===== DESCRIPTION (pleine largeur) ===== */}
                    <div style={{ ...formStyles.formGroup, ...formStyles.fullWidth }}>
                        <label style={formStyles.label} htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Décrivez ici la catégorie"
                            style={getTextareaStyle(!!errors.description, '100px')}
                        />
                        {errors.description && (
                            <span style={formStyles.fieldError}>
                                {errors.description}
                            </span>
                        )}
                    </div>

                    {/* ===== SUBMIT BUTTON ===== */}
                    <div style={formStyles.actions}>
                      <button
                          type="submit"
                          disabled={loading || !hasChanges()}
                          style={loading || !hasChanges() ? formStyles.editBtnDisabled : formStyles.editBtn}
                      >
                          <IoPencilSharp size={16} color="#FFFFFF" />
                          {loading ? 'Mise à jour en cours...' : 'Mettre à jour la catégorie'}
                      </button>
                    </div>
                  </div>
                </form>
            </div>
        </AdminLayout>

    );
};
export default EditCategory;