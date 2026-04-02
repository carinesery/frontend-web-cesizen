import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { set, z } from 'zod';
import { updateArticleBodySchema } from '../schemas/articleSchema';
import { categoryService } from '../services/categoryService';
import { articleService } from '../services/articleService';
import AdminLayout from '../components/AdminLayout';
import { IoPencilSharp } from 'react-icons/io5';
import { formStyles, getInputStyle, getTextareaStyle, getFileInputStyle } from '../styles/formStyles';

const EditArticle = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [initialData, setInitialData] = useState(null);
    const [removePicture, setRemovePresentationImage] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        status: '',
        categories: [],
        presentationImageUrl: null,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    // ========== CHARGEMENT DES CATÉGORIES POUR LE SELECT ========== //
    useEffect(() => {

        const fetchArticle = async () => {
            try {
                setLoading(true);
                const data = await articleService.getBySlug(slug);
                console.log("Données des catégories récupérées:", data);
                setFormData({
                    title: data.title,
                    summary: data.summary,
                    content: data.content,
                    status: data.status,
                    categories: data.categories.map(category => category.slug),
                    presentationImageUrl: data.presentationImageUrl,
                });

                setInitialData({
                    title: data.title,
                    summary: data.summary,
                    content: data.content,
                    status: data.status,
                    categories: data.categories.map(category => category.slug),
                });
            } catch (error) {
                console.error('Erreur lors du chargement de l\'article:', error);
            } finally {
                setLoading(false);
            }
        }
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll();

                setCategories(data.map(category => ({ title: category.title, slug: category.slug })));
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
            }
        };

        fetchArticle();
        fetchCategories();
    }, [slug]);

    // Les erreurs de validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Message de succès
    const [successMessage, setSuccessMessage] = useState('');

    // Fonction pour vérifier s'il y a des changements dans le formulaire
    const hasChanges = () => {
        if (!initialData) return false;

        return (
            formData.title !== initialData.title ||
            formData.summary !== initialData.summary ||
            formData.content !== initialData.content ||
            formData.status !== initialData.status ||
            JSON.stringify(formData.categories) !== JSON.stringify(initialData.categories) ||
            selectedFile !== null ||
            removePicture // 👈 important
        );
    };


    // ========== VALIDATION DES CHAMPS========== //
    // Valide UN champ à la fois (quand tu quittes le champ - onBlur)
    const validateField = (name, value) => {
        try {
            // On crée un schéma partiel juste pour ce champ
            const fieldSchema = (updateArticleBodySchema as any).pick({ [name]: true });
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

    // ========== HANDLERS ========== //
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "categories") {
            const options = (e.target as HTMLSelectElement).options;
            const selectedValues = Array.from(options)
                .filter((option: HTMLOptionElement) => option.selected)
                .map((option: HTMLOptionElement) => option.value);


            setFormData(prev => ({
                ...prev,
                categories: selectedValues
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
        console.log("formData.categories", formData.categories);
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
                    presentationImageUrl: 'Seules les images sont acceptées'
                }));
                setSelectedFile(null);
                return;
            }

            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    presentationImageUrl: 'Le fichier est trop volumineux (max 5MB)'
                }));
                setSelectedFile(null);
                return;
            }

            // OK, on sauvegarde le fichier
            setSelectedFile(file);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.presentationImageUrl;
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

            const validatedData = updateArticleBodySchema.parse(formData);
            setErrors({});

            const formDataToSend = new FormData();
            formDataToSend.append('title', validatedData.title);
            formDataToSend.append('summary', validatedData.summary);
            formDataToSend.append('content', validatedData.content);
            formDataToSend.append('status', validatedData.status);
            formDataToSend.append('categories', JSON.stringify(validatedData.categories));

            if (selectedFile) {
                formDataToSend.append('presentationImageUrl', selectedFile);
            }

            if (validatedData.removePresentationImage) {
                formDataToSend.append('removePresentationImage', 'true');
                setRemovePresentationImage(true);
            }

            if (!hasChanges()) {
                setErrors({ submit: 'Aucune modification détectée' });
                return;
            }

            // 3. Appeler le service backend
            const updatedArticle = await articleService.update(slug, formDataToSend);

            // 4. Afficher succès
            setLoading(false);
            setSuccessMessage(`✅ Article ${updatedArticle.title} mis à jour avec succès !`);

            // 5. Réinitialiser le formulaire
            setFormData({
                title: '',
                summary: '',
                content: '',
                status: '',
                categories: [],
                presentationImageUrl: null,
            });
            setSelectedFile(null);

            // 6. Rediriger après 2 secondes
            setTimeout(() => {
                navigate('/admin/articles');
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
            <div style={{ ...formStyles.container, maxWidth: 'none' }}>
                <div style={formStyles.formHeader}>
                    <h2 style={formStyles.formTitle}>Modifier l'article</h2>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/articles')}
                        style={formStyles.backBtn}
                    >
                        ← Retour aux articles
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

                    {/* ===== TITRE + STATUT ===== */}
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
                            placeholder="Titre de l'article"
                        />
                    </div>

                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label}>Statut</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={formStyles.select}
                            onBlur={handleBlur}
                        >
                            <option value="DRAFT">Brouillon</option>
                            <option value="PUBLISHED">Publié</option>
                            <option value="ARCHIVED">Archivé</option>
                        </select>
                    </div>

                    {/* ===== RÉSUMÉ (pleine largeur) ===== */}
                    <div style={{ ...formStyles.formGroup, ...formStyles.fullWidth }}>
                        <label style={formStyles.label}>Résumé</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            style={getTextareaStyle(false, '80px')}
                            onBlur={handleBlur}
                            placeholder="Résumé court de l'article"
                        />
                    </div>

                    {/* ===== CONTENU (pleine largeur) ===== */}
                    <div style={{ ...formStyles.formGroup, ...formStyles.fullWidth }}>
                        <label style={formStyles.label}>Contenu *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            style={getTextareaStyle(false, '200px')}
                            onBlur={handleBlur}
                            placeholder="Contenu principal de l'article"
                        />
                    </div>

                    {/* ===== CATÉGORIES + IMAGE ===== */}
                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label}>Catégories</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                            {categories.map(cat => (
                                <label key={cat.slug} style={formStyles.checkboxRow}>
                                    <input
                                        type="checkbox"
                                        checked={formData.categories.includes(cat.slug)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    categories: [...prev.categories, cat.slug]
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    categories: prev.categories.filter(c => c !== cat.slug)
                                                }));
                                            }
                                        }}
                                    />
                                    {cat.title}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={formStyles.formGroup}>
                        <label style={formStyles.label} htmlFor="presentationImageUrl">Image de présentation (optionnel)</label>
                        <input
                            id="presentationImageUrl"
                            type="file"
                            name="presentationImageUrl"
                            onChange={handleFileChange}
                            accept="image/*"
                            style={getFileInputStyle(!!errors.presentationImageUrl)}
                        />
                        {selectedFile && (
                            <small style={formStyles.fileSuccess}>
                                ✅ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)}KB)
                            </small>
                        )}
                        {errors.presentationImageUrl && (
                            <span style={formStyles.fieldError}>
                                {errors.presentationImageUrl}
                            </span>
                        )}
                        {formData.presentationImageUrl && !selectedFile && (
                            <div style={formStyles.imagePreview}>
                                <img src={`http://localhost:3000${formData.presentationImageUrl}`} width="100" style={{ borderRadius: '8px' }} />
                                <button type="button"
                                    style={formStyles.deleteImageBtn}
                                    onClick={() => {
                                        setRemovePresentationImage(true);
                                        setSelectedFile(null);
                                        setFormData(prev => ({ ...prev, presentationImageUrl: null }));
                                    }}
                                >
                                    Supprimer la photo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div style={formStyles.actions}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            style={formStyles.cancelBtn}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !hasChanges()}
                            style={loading || !hasChanges() ? formStyles.editBtnDisabled : formStyles.editBtn}
                        >
                            <IoPencilSharp size={16} color="#FFFFFF" />
                            {loading ? 'Mise à jour...' : 'Mettre à jour l\'article'}
                        </button>
                    </div>
                  </div>
                </form>
            </div >
        </AdminLayout >
    );
};

export default EditArticle;
