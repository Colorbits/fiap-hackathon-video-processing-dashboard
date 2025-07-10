import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remover dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('user');
    
    // Redirecionar para a página de login
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const userName = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || 'Usuário';
    } catch {
      return 'Usuário';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">
            FIAP Hackathon
          </NavLink>
          <span className="brand-subtitle">Processamento de Vídeos</span>
        </div>
        
        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
          <div className="navbar-start">
            <NavLink to="/videos" className="navbar-item">
              Meus Vídeos
            </NavLink>
            <NavLink to="/upload" className="navbar-item">
              Upload
            </NavLink>
          </div>

          <div className="navbar-end">
            <div className="navbar-user-menu">
              <span className="user-name">{userName()}</span>
              <button onClick={handleLogout} className="logout-button">
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
