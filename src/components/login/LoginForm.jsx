import { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // URL da API de backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMode = () => {
    setIsLoginMode(prev => !prev);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const response = await axios.post(`${API_URL}/auth/login`, { email: formData.email, password: formData.password });
        const data = response.data;

        handleAuthSuccess(data);

      } else {
        await axios.post(`${API_URL}/users`, { name: formData.name, email: formData.email, password: formData.password });
        handleRegisterSuccess();
      }

    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (data) => {
    if (isLoginMode) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      if (data.expiresAt) {
        localStorage.setItem('expiresAt', data.expiresAt);
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setSuccess('Login realizado com sucesso!');

      window.location.href = '/dashboard';
    } else {
      setSuccess('Cadastro realizado com sucesso! Você já pode fazer login.');
      setIsLoginMode(true);
      setFormData({
        name: '',
        email: '',
        password: ''
      });
    }
  };

  const handleRegisterSuccess = () => {
    setSuccess('Cadastro realizado com sucesso! Você já pode fazer login.');
    setIsLoginMode(true);
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">
        FIAP Hackathon
        <div className="subtitle">Sistema de Processamento de Vídeos</div>
      </h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLoginMode}
              placeholder="Digite seu nome completo"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Digite seu email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Digite sua senha"
            minLength={isLoginMode ? undefined : 6}
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : isLoginMode ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <div className="auth-toggle">
        {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button
          onClick={toggleMode}
          className="toggle-button"
        >
          {isLoginMode ? 'Cadastre-se' : 'Faça login'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
