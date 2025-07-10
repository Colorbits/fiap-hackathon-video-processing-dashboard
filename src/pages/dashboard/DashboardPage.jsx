import { useVideoContext } from '../../contexts';
import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { processingVideosCount, processedVideosCount, estimatedVideoSizeInMB } = useVideoContext();

  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || 'Usuário';
    } catch {
      return 'Usuário';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="welcome-section">
        <h1>Bem-vindo, {getUserName()}!</h1>
        <p>Gerencie seus vídeos e acompanhe o processamento.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Vídeos Processados</h3>
          <div className="card-content">
            <span className="card-value">{processedVideosCount}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Em Processamento</h3>
          <div className="card-content">
            <span className="card-value">{processingVideosCount}</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Espaço Utilizado</h3>
          <div className="card-content">
            <span className="card-value">{estimatedVideoSizeInMB} MB</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/videos')} className="action-button">
            Ver meus vídeos
          </button>
          <button onClick={() => navigate('/videos')} className="action-button primary">
            Fazer upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
