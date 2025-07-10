import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoContext } from '../../contexts';
import './VideoList.css';

const VideoList = () => {
  const navigate = useNavigate();

  const {
    videos,
    loadingVideos: loading,
    videosError: error,
    loadVideos
  } = useVideoContext();

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const getStatusInfo = (status) => {
    const statusMap = {
      'UPLOADED': { className: 'status-uploaded', message: 'Enviado' },
      'UPLOADING': { className: 'status-uploading', message: 'Enviando...' },
      'PROCESSING': { className: 'status-processing', message: 'Processando...' },
      'DONE': { className: 'status-completed', message: 'Concluído' },
      'ERROR': { className: 'status-failed', message: 'Falhou' },
    };

    return statusMap[status] || { className: '', message: status };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando vídeos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erro ao carregar vídeos</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => loadVideos()}>Tentar novamente</button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="empty-container">
        <h3>Nenhum vídeo encontrado</h3>
        <p>Você ainda não tem vídeos processados. Faça upload de um vídeo para começar.</p>
        <button className="upload-button" onClick={() => navigate('/upload')}>Fazer upload</button>
      </div>
    );
  }



  return (
    <div className="video-list-container">
      <h2>Seus Vídeos</h2>
      <div className="video-grid">
        {videos.reverse().map(video => {
          const statusInfo = getStatusInfo(video.status);

          return (
            <div
              key={video.id || video.uuid}
              className="video-card"
              onClick={() => navigate(`/videos/${video.id || video.uuid}`)}
            >
              <div className="video-info">
                <h3>{video.name || 'Vídeo sem título'}</h3>
                <p className="status">
                  Status: <span className={statusInfo.className}>{statusInfo.message}</span>
                </p>
              </div>

              {video.status === 'DONE' && (
                <div className="video-actions">
                  <button
                    className="action-button view"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/videos/${video.id || video.uuid}`);
                    }}
                  >
                    Visualizar
                  </button>
                  <button
                    className="action-button download"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (video.url) {
                        window.open(video.url, '_blank');
                      } else {
                        alert('Vídeo ainda não disponível para download');
                      }
                    }}
                    disabled={!video.url}
                  >
                    Baixar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoList;
