'use client';
import React, { useState } from 'react';
import InputField from '../../components/Pageconnexion/InputField';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'jardinier') {
          window.location.href = '/jardiniers';
        } else if (data.user.role === 'proprietaire') {
          window.location.href = '/jardins';
        } else if (data.user.role === 'ami_du_vert') {
          window.location.href = '/accueil';
        } else {
          setErrorMessage('Rôle inconnu.');
        }
      } else {
        setErrorMessage(data.error || 'Identifiant ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      color: '#021904',
      marginBottom: '20px',
      fontSize: '28px',
    },
    intro: {
      textAlign: 'center',
      color: '#4e784f',
      fontSize: '20px',
      marginBottom: '30px',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    passwordWrapper: {
      position: 'relative',
      marginBottom: '20px',
    },
    passwordInput: {
      width: '100%',
      padding: '14px',
      paddingRight: '50px',
      border: '2px solid #6ec173',
      borderRadius: '10px',
      fontSize: '18px',
      color: '#021904',
    },
    toggleButton: {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6ec173',
      fontSize: '14px',
    },
    forgot: {
      textAlign: 'right',
      marginTop: '-10px',
      marginBottom: '20px',
      fontSize: '16px',
    },
    forgotLink: {
      color: '#6ec173',
      textDecoration: 'none',
    },
    button: {
      padding: '14px',
      backgroundColor: '#6ec173',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '18px',
    },
    register: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '18px',
      color: '#021904',
    },
  };

  const pageStyle = {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingTop: '100px',
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <div style={styles.container}>
          <h2 style={styles.title}>Connexion à JardinSolidaire</h2>
          <p style={styles.intro}>
            Ravie de vous revoir sur JardinSolidaire 🌱 <br />
            Connectez-vous pour cultiver des liens et des jardins.
          </p>
          <form style={styles.form} onSubmit={handleSubmit}>
            <InputField
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
            />

            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            <p style={styles.forgot}>
              <a
                href="/mdp_oublier"
                style={{
                  color: '#6ec173',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Mot de passe oublié ?
              </a>
            </p>
            <button type="submit" style={styles.button}>Se connecter</button>
            {errorMessage && (
            <p style={{ color: 'red', fontSize: '16px', marginTop: '10px', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}
          </form>

          <p style={{ ...styles.register, color: '#e3107d' }}>
            Pas encore de compte ? <a
              href="/inscription"
              style={{
                color: '#021904',
                textDecoration: 'none',
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Inscrivez-vous
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
