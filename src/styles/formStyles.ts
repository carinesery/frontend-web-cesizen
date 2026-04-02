import React from 'react';
import { COLORS } from '../constants/themes';

/**
 * Styles partagés pour tous les formulaires admin — version web
 * Suit la charte graphique des écrans tableaux (pas de fontFamily forcé)
 */
export const formStyles: Record<string, React.CSSProperties> = {

  // ===== PAGE =====

  // Page pleine (Login uniquement)
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: `linear-gradient(to bottom, ${COLORS.softAqua}, ${COLORS.softViolet})`,
  },

  // Conteneur dans AdminLayout — occupe tout l'espace
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '20px',
    padding: '16px 16px 0 16px',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },

  // ===== EN-TÊTE FORMULAIRE (titre + bouton retour) =====

  formHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  formTitle: {
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    color: COLORS.neutral.black,
    margin: 0,
  },

  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: COLORS.accent,
    padding: '12px 24px',
    border: `1.5px solid ${COLORS.accent}`,
    borderRadius: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    transition: 'all 0.2s',
  },

  // ===== FORM CARD =====

  form: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: '28px 32px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: `1.5px solid ${COLORS.backgroundVisible}`,
    overflowY: 'auto',
  },

  // Grille 2 colonnes à l'intérieur du form
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },

  // Pour un champ qui doit occuper toute la largeur
  fullWidth: {
    gridColumn: '1 / -1',
  },

  // ===== MESSAGES =====

  successMessage: {
    background: COLORS.softAqua,
    color: COLORS.primary,
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    border: `1px solid ${COLORS.secondary}`,
  },

  errorMessage: {
    background: '#FFF5F5',
    color: COLORS.error,
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    border: `1px solid #FFD4D4`,
  },

  // ===== CHAMPS =====

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    color: COLORS.neutral.gray,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },

  input: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#F7F9FB',
    border: `1.5px solid ${COLORS.neutral.borderGray}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    color: COLORS.text,
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  inputError: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#FFF8F8',
    border: '1.5px solid #FF6B6B',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    color: COLORS.text,
    boxSizing: 'border-box',
    outline: 'none',
  },

  select: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#F7F9FB',
    border: `1.5px solid ${COLORS.neutral.borderGray}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    color: COLORS.text,
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'auto',
  },

  fileInput: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#F7F9FB',
    border: `1.5px dashed ${COLORS.neutral.borderGray}`,
    borderRadius: '8px',
    fontSize: '13px',
    color: COLORS.textLight,
    boxSizing: 'border-box',
    cursor: 'pointer',
  },

  fileInputError: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#FFF8F8',
    border: '1.5px dashed #FF6B6B',
    borderRadius: '8px',
    fontSize: '13px',
    color: COLORS.textLight,
    boxSizing: 'border-box',
    cursor: 'pointer',
  },

  // ===== TEXTES =====

  fieldError: {
    color: COLORS.error,
    fontSize: '12px',
    marginTop: '4px',
  },

  helperText: {
    display: 'block',
    color: COLORS.textLight,
    fontSize: '12px',
    marginTop: '4px',
  },

  fileSuccess: {
    display: 'block',
    marginTop: '6px',
    color: COLORS.primary,
    fontSize: '12px',
    fontWeight: 500,
  },

  // ===== GRILLE (ancien — conservé pour compatibilité) =====

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },

  // ===== BOUTONS =====

  submitBtn: {
    padding: '12px 32px',
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },

  submitBtnDisabled: {
    padding: '12px 32px',
    backgroundColor: '#C8D0D8',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '32px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    marginTop: '8px',
  },

  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: `1px solid ${COLORS.neutral.borderGray}`,
    gridColumn: '1 / -1',
    justifyContent: 'flex-end',
  },

  cancelBtn: {
    padding: '12px 32px',
    backgroundColor: '#F7F9FB',
    color: COLORS.textLight,
    border: `1.5px solid ${COLORS.neutral.borderGray}`,
    borderRadius: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    transition: 'all 0.2s',
  },

  confirmBtn: {
    padding: '12px 32px',
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    transition: 'opacity 0.2s',
  },

  confirmBtnDisabled: {
    padding: '12px 32px',
    backgroundColor: '#C8D0D8',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '32px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },

  // Bouton spécifique aux pages Modifier (accent + blanc)
  editBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    backgroundColor: COLORS.accent,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    transition: 'opacity 0.2s',
  },

  editBtnDisabled: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    backgroundColor: '#C8D0D8',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '32px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },

  // ===== DIVERS =====

  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: COLORS.text,
    padding: '3px 0',
  },

  imagePreview: {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  deleteImageBtn: {
    padding: '6px 12px',
    backgroundColor: COLORS.backgroundDelete,
    color: COLORS.delete,
    border: `1px solid ${COLORS.delete}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
  },
};

// ===== HELPERS =====

export const getInputStyle = (hasError: boolean): React.CSSProperties =>
  hasError ? formStyles.inputError : formStyles.input;

export const getTextareaStyle = (hasError: boolean, minHeight?: string): React.CSSProperties => ({
  ...(hasError ? formStyles.inputError : formStyles.input),
  minHeight: minHeight || 'auto',
  resize: 'vertical' as const,
});

export const getSelectStyle = (hasError: boolean): React.CSSProperties =>
  hasError ? { ...formStyles.select, border: '1.5px solid #FF6B6B', backgroundColor: '#FFF8F8' } : formStyles.select;

export const getFileInputStyle = (hasError: boolean): React.CSSProperties =>
  hasError ? formStyles.fileInputError : formStyles.fileInput;
