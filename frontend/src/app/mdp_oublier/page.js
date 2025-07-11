'use client';
import React, { useState } from 'react';
import InputField from '../../components/Pageconnexion/InputField';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailInvalide, setEmailInvalide] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setEmailInvalide(false);

    try {
      const response = await fetch('http://localhost:5000/api/mdp/verifier-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
      localStorage.setItem('email', email); // ← on stocke l'email
      window.location.href = '/modifier_mdp';
      } else {
        setEmailInvalide(true);
        setMessage("🌿 Cette adresse e-mail n'est pas connue. Créez un compte pour rejoindre JardinSolidaire.");
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '100px' }}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#021904',
            marginBottom: '20px',
            fontSize: '28px',
          }}>
            Vous avez oublié votre mot de passe ?
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#4e784f',
            fontSize: '18px',
            marginBottom: '30px',
          }}>
            Pas de panique 🌱 <br />
            Entrez votre e-mail et nous vous guiderons pour en créer un nouveau.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <InputField
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
            />
            <button type="submit" style={{
              padding: '14px',
              backgroundColor: '#6ec173',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '18px',
              marginTop: '20px'
            }}>
              Réinitialiser le mot de passe
            </button>
            {message && (
              <p style={{ color: emailInvalide ? '#e3107d' : '#021904', fontSize: '16px', marginTop: '20px', textAlign: 'center' }}>
                {message}
              </p>
            )}
            {emailInvalide && (
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                <a href="/inscription" style={{ color: '#6ec173', textDecoration: 'underline' }}>
                  Créer un compte
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
