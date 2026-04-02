import React from 'react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formStyles } from '../styles/formStyles';
import { COLORS } from '../constants/themes';
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formStyles.pageContainer}>
      <div style={{ width: '100%', maxWidth: '460px', padding: '0 24px' }}>
        <h1 style={{
          textAlign: 'center',
          fontFamily: 'Just Sans',
          fontSize: '28px',
          color: COLORS.primary,
          marginBottom: '8px',
        }}>
          Connectez-vous
        </h1>
        <p style={{
          textAlign: 'center',
          fontFamily: 'Nunito Sans',
          fontSize: '14px',
          color: COLORS.textLight,
          marginBottom: '32px',
        }}>
          Avec CESIZen, prenez soin de votre santé mentale
        </p>

        <form onSubmit={handleSubmit} style={{ ...formStyles.form, padding: '28px' }}>
          {error && <div style={formStyles.errorMessage}>{error}</div>}

          <div style={formStyles.formGroup}>
            <label style={formStyles.label}>Email</label>
            <div style={{ position: 'relative' }}>
              <IoMailOutline
                size={18}
                color={COLORS.textLight}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                style={{ ...formStyles.input, paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={formStyles.formGroup}>
            <label style={formStyles.label}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <IoLockClosedOutline
                size={18}
                color={COLORS.textLight}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ ...formStyles.input, paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? formStyles.submitBtnDisabled : formStyles.submitBtn}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
