'use client';
import React, { useState } from 'react';
import InputField from '../../components/Pageconnexion/InputField';
import SelectField from '../../components/Pageinscription/SelectField';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

export default function Inscription() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;
  const isValidPassword = hasUppercase && hasNumber && hasSpecialChar && hasMinLength;
  const passwordsMatch = password === confirmPassword;
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword) {
      alert("Votre mot de passe ne respecte pas les critères de sécurité.");
      return;
    }
    if (!passwordsMatch) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Bienvenue ${data.user.prenom} !`);
        } else {
        setErrorMessage(data.error || 'Erreur lors de l’inscription');
        }
            } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Impossible de contacter le serveur');
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
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
    paragraph: {
      textAlign: 'center',
      marginBottom: '32px',
      color: '#021904',
      fontSize: '20px',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '18px',
      marginBottom: '8px',
      color: '#021904',
    },
    list: {
      fontSize: '18px',
      marginTop: '0',
      marginBottom: '12px',
      paddingLeft: '20px',
      color: '#021904',
    },
    passwordHint: (condition) => ({
      fontSize: '16px',
      color: condition ? 'green' : 'red',
      marginTop: '0px',
      marginBottom: '4px',
    }),
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
    errorText: {
      fontSize: '16px',
      color: 'red',
      marginBottom: '12px',
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
    },
    note: {
      fontSize: '18px',
      textAlign: 'center',
      marginTop: '20px',
      color: '#021904',
      lineHeight: '1.5',
    },
  };

  const pageStyle = {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingTop: '50px',
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <div style={styles.container}>
          <h2 style={styles.title}>Bienvenue sur JardinSolidaire !</h2>
          <p style={styles.paragraph}>
            Vous êtes sur le point de rejoindre une communauté qui fait pousser bien plus que des plantes : <br />
            entraide, solidarité et sourires. 🌿🌻
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>Prénom</label>
            <InputField type="text" name="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom" required />

            <label style={styles.label}>Nom</label>
            <InputField type="text" name="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" required />

            <label style={styles.label}>Adresse e-mail</label>
            <p style={{ ...styles.label, fontSize: '16px' }}>
              📩 Veillez à entrer une adresse valide : un e-mail de vérification vous sera envoyé.
            </p>
            <InputField type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre adresse e-mail" required />

            <label style={styles.label}>Mot de passe</label>
            <p style={styles.label}>🔒 Votre mot de passe doit contenir :</p>
            <ul style={styles.list}>
              <li>Au moins 8 caractères</li>
              <li>Une majuscule</li>
              <li>Un chiffre</li>
              <li>Un caractère spécial</li>
            </ul>

            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                minLength="8"
                pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+"
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

            <p style={styles.passwordHint(hasMinLength)}>✔️ 8 caractères minimum</p>
            <p style={styles.passwordHint(hasUppercase)}>✔️ Une majuscule</p>
            <p style={styles.passwordHint(hasNumber)}>✔️ Un chiffre</p>
            <p style={styles.passwordHint(hasSpecialChar)}>✔️ Un caractère spécial</p>

            <label style={styles.label}>Confirmez votre mot de passe</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.toggleButton}
              >
                {showConfirmPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            {!passwordsMatch && confirmPassword && (
              <p style={styles.errorText}>❌ Les mots de passe ne correspondent pas</p>
            )}

            <label style={styles.label}>Quel est votre rôle ?</label>
            <SelectField
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'proprietaire', label: 'Je possède un jardin' },
                { value: 'ami_du_vert', label: 'Je souhaite jardiner chez quelqu’un' },
              ]}
              required
            />

            <button type="submit" style={styles.button}>S&apos;inscrire</button>
            {errorMessage && (
                <p style={{ color: 'red', fontSize: '16px', marginTop: '10px', textAlign: 'center' }}>
                    {errorMessage}
                </p>
                )}
          </form>

          <p style={{ ...styles.register, color: '#e3107d' }}>
            Déjà inscrit ? <a
                href="/connexion"
                style={{
                color: '#021904',
                textDecoration: 'none',
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
                Se connecter
            </a>
            </p>

          <p style={styles.note}>
            En vous inscrivant, vous contribuez à une plateforme bienveillante dédiée à la nature et au partage. 💚
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
