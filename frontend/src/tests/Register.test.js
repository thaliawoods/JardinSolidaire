// frontend/src/tests/Register.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ✅ English route/file name, French UI text
import RegisterPage from '../app/register/page.js';

describe('Formulaire d’inscription', () => {
  beforeEach(() => {
    global.fetch = undefined;
    jest.clearAllMocks();
  });

  it("affiche l'erreur 'email déjà utilisé' renvoyée par l'API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'email_already_used' }),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'Abcdef12!' } });

    fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(screen.getByText('Cet email est déjà utilisé.')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/inscription$/),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringMatching(/"mot_de_passe":"Abcdef12!"/),
      })
    );
  });

  it('affiche un message générique si une autre erreur survient', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'server_error' }),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'alice@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'Abcdef12!' } });

    fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(screen.getByText('Erreur à l’inscription.')).toBeInTheDocument();
    });
  });
});
