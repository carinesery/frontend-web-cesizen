import React from "react";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { COLORS } from "../constants/themes";
import logoCesizen from "../assets/images/logo-cesizen.png";

export default function NeedsLegalPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const legalToken = searchParams.get("token");

    const [termsConsent, setTermsConsent] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        if (!legalToken) {
            setMessage("Erreur : token manquant");
            return;
        }

        try {
            setLoading(true);
            const response = await userService.acceptLegal(termsConsent, privacyConsent, legalToken);
            setMessage(response.message || "Conditions acceptées avec succès !");
            setSuccess(true);

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Erreur lors de l'acceptation des conditions");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    if (!legalToken) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <img src={logoCesizen} alt="Logo CESIZen" style={styles.logo} />
                    <h1 style={styles.brand}>CESIZen</h1>
                    <div style={{ ...styles.messageBox, backgroundColor: '#FFF5F5', borderColor: '#FFD4D4', color: COLORS.error }}>
                        <span style={styles.messageIcon}>❌</span>
                        <p style={styles.messageText}>Lien invalide ou expiré. Veuillez recommencer la procédure.</p>
                    </div>
                    <button onClick={() => navigate("/login", { replace: true })} style={styles.btn}>
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <img src={logoCesizen} alt="Logo CESIZen" style={styles.logo} />
                <h1 style={styles.brand}>CESIZen</h1>

                <p style={styles.subtitle}>
                    Votre email a été confirmé ! Pour activer votre compte, veuillez accepter les conditions suivantes.
                </p>

                {message && (
                    <div style={{
                        ...styles.messageBox,
                        backgroundColor: success ? COLORS.softAqua : '#FFF5F5',
                        borderColor: success ? COLORS.secondary : '#FFD4D4',
                        color: success ? COLORS.primary : COLORS.error,
                    }}>
                        <span style={styles.messageIcon}>{success ? '✅' : '❌'}</span>
                        <p style={styles.messageText}>{message}</p>
                    </div>
                )}

                {!success && (
                    <div style={styles.consentSection}>
                        <h2 style={styles.consentTitle}>Conditions d'utilisation</h2>

                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={termsConsent}
                                onChange={(e) => setTermsConsent(e.target.checked)}
                                style={styles.checkbox}
                            />
                            J'accepte les conditions générales d'utilisation
                        </label>

                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={privacyConsent}
                                onChange={(e) => setPrivacyConsent(e.target.checked)}
                                style={styles.checkbox}
                            />
                            J'accepte la politique de confidentialité
                        </label>

                        <button
                            disabled={!termsConsent || !privacyConsent || loading}
                            onClick={handleAccept}
                            style={
                                !termsConsent || !privacyConsent || loading
                                    ? styles.btnDisabled
                                    : styles.btn
                            }
                        >
                            {loading ? 'Validation en cours…' : 'Valider et activer mon compte'}
                        </button>
                    </div>
                )}

                {success && (
                    <p style={styles.redirectText}>Redirection vers la page de connexion…</p>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(to bottom, ${COLORS.softAqua}, ${COLORS.softViolet})`,
        padding: '20px',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        backgroundColor: '#FFFFFF',
        padding: '48px 40px',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        border: `1.5px solid ${COLORS.backgroundVisible}`,
        maxWidth: '480px',
        width: '100%',
    },
    logo: {
        width: '72px',
        height: '72px',
        objectFit: 'contain',
    },
    brand: {
        fontFamily: 'Just Sans, sans-serif',
        fontWeight: 700,
        fontSize: '28px',
        color: COLORS.primary,
        margin: 0,
    },
    subtitle: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        color: COLORS.neutral.gray,
        textAlign: 'center',
        lineHeight: 1.6,
        margin: 0,
    },
    redirectText: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'italic',
        color: COLORS.neutral.gray,
        margin: 0,
    },

    // Message
    messageBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1.5px solid',
        width: '100%',
        boxSizing: 'border-box',
    },
    messageIcon: {
        fontSize: '20px',
        flexShrink: 0,
    },
    messageText: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        margin: 0,
        lineHeight: 1.5,
    },

    // Consent
    consentSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        paddingTop: '8px',
        borderTop: `1px solid ${COLORS.neutral.borderGray}`,
    },
    consentTitle: {
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        color: COLORS.text,
        margin: 0,
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        color: COLORS.text,
        cursor: 'pointer',
        padding: '8px 0',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        accentColor: COLORS.primary,
        cursor: 'pointer',
        flexShrink: 0,
    },

    // Buttons
    btn: {
        width: '100%',
        padding: '14px 24px',
        backgroundColor: COLORS.primary,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '32px',
        cursor: 'pointer',
        fontSize: '15px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        transition: 'opacity 0.2s',
    },
    btnDisabled: {
        width: '100%',
        padding: '14px 24px',
        backgroundColor: '#C8D0D8',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '32px',
        cursor: 'not-allowed',
        fontSize: '15px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
    },
};
