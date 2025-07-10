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
  const [useMock, setUseMock] = useState(false);

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

     
      try {
        const response = await axios.post(`${API_URL}/auth/login`, { name: formData.name, email: formData.email, password: formData.password });
        const data = response.data;
        

        handleAuthSuccess(data);
      } catch (axiosError) {
        console.error('Erro ao acessar API:', axiosError);
        
        // Tratamento de erros específico para axios
        if (axiosError.response) {
          // A requisição foi feita e o servidor respondeu com um status de erro
          const errorMessage = axiosError.response.data?.message || 
            `Erro ${axiosError.response.status}: ${axiosError.response.statusText}`;
          setError(errorMessage);
        } else if (axiosError.request) {
          // A requisição foi feita mas não houve resposta
          console.log('Sem resposta do servidor:', axiosError.request);
          setError('Servidor indisponível. Tente novamente mais tarde.');
          
          // Ativa o modo offline (mock) automaticamente se o servidor estiver indisponível
          setUseMock(true);
          
          // Tenta usar o mock diretamente
          if (isLoginMode) {
            const mockResult = mockLogin(formData.email, formData.password);
            if (mockResult.success) {
              handleAuthSuccess(mockResult.data);
            } else {
              setError(mockResult.message);
            }
          } else {
            const mockResult = mockRegister(formData.name, formData.email, formData.password);
            if (mockResult.success) {
              handleAuthSuccess(mockResult.data);
            } else {
              setError(mockResult.message);
            }
          }
        } else {
          // Erro ao configurar a requisição
          console.log('Erro de configuração:', axiosError.message);
          setError('Erro ao configurar a requisição: ' + axiosError.message);
        }
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
      
      // Redirecionar para a dashboard usando React Router
      // Se o componente useNavigate estiver disponível
      window.location.href = '/dashboard';
    } else {
      // Para cadastro: mostrar mensagem de sucesso e mudar para tela de login
      setSuccess('Cadastro realizado com sucesso! Você já pode fazer login.');
      setIsLoginMode(true);
      // Limpar campos após o cadastro
      setFormData({
        name: '',
        email: '',
        password: ''
      });
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">
        FIAP Hackathon
        <div className="subtitle">Sistema de Processamento de Vídeos</div>
      </h1>

      {useMock && (
        <div className="mock-alert">
          Usando modo offline (mock). A API não está acessível.
        </div>
      )}

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
