import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { COLORS } from "../constants/themes";
import logoCesizen from "../assets/images/logo-cesizen.png";

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const token = searchParams.get("token");

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await userService.confirmEmail(token);
                setMessage(response.message);
                setSuccess(true);

                if (response.needsTermsConsent && response.legalToken) {
                    navigate(`/admin/users/needs-legal?token=${encodeURIComponent(response.legalToken)}`, { replace: true });
                    return;
                }
            } catch (err) {
                setMessage("Lien invalide ou expiré");
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) confirmEmail();
        else {
            setMessage("Token manquant dans l'URL");
            setLoading(false);
        }
    }, [token]);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <img src={logoCesizen} alt="Logo CESIZen" style={styles.logo} />
                <h1 style={styles.brand}>CESIZen</h1>

                {loading ? (
                    <div style={styles.loaderSection}>
                        <div style={styles.spinner} />
                        <p style={styles.loadingText}>Vérification en cours…</p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            ...styles.messageBox,
                            backgroundColor: success ? COLORS.softAqua : '#FFF5F5',
                            borderColor: success ? COLORS.secondary : '#FFD4D4',
                            color: success ? COLORS.primary : COLORS.error,
                        }}>
                            <span style={styles.messageIcon}>{success ? '✅' : '❌'}</span>
                            <p style={styles.messageText}>{message}</p>
                        </div>

                        <button
                            onClick={() => navigate("/login", { replace: true })}
                            style={styles.btn}
                        >
                            Aller à la page de connexion
                        </button>
                    </>
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

    // Loader
    loaderSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 0',
    },
    spinner: {
        width: '36px',
        height: '36px',
        border: `3px solid ${COLORS.neutral.borderGray}`,
        borderTopColor: COLORS.primary,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    loadingText: {
        fontSize: '15px',
        fontFamily: 'Inter, sans-serif',
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
};