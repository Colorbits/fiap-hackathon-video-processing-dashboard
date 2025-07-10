import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideoContext } from '../../contexts';
import VideoFrames from '../../components/videoFrames/VideoFrames';
import ThumbnailSelector from '../../components/videoFrames/ThumbnailSelector';
import './VideoDetailPage.css';
const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL

const VideoDetailPage = () => {
  const { videoUuid } = useParams();
  const navigate = useNavigate();
  const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);

  const {
    videos,
    currentVideo,
    setCurrentVideo,
    loadingCurrentVideo,
    currentVideoError,
    loadVideoFrames,
    deleteVideo,
    selectFrameAsThumbnail,
    startPollingVideoStatus
  } = useVideoContext();

  useEffect(() => {
    // Carrega os dados do vídeo inicialmente
    if (videoUuid) {
      loadVideoFrames(videoUuid);

      if (videos?.length) {
        const video = videos.find(v => v.uuid === videoUuid);
        setCurrentVideo(video);
      }
    }


  }, [videoUuid, loadVideoFrames, videos, setCurrentVideo]);

  // Inicia o polling para atualização de status quando o vídeo está em processamento
  useEffect(() => {
    if (currentVideo && ['processing', 'uploading'].includes(currentVideo.status?.toLowerCase()) && videoUuid) {
      // Inicia o polling e armazena a função de limpeza
      const stopPolling = startPollingVideoStatus(videoUuid);

      // Limpa o polling quando o componente é desmontado ou o vídeo muda
      return () => {
        if (stopPolling) stopPolling();
      };
    }
  }, [currentVideo, videoUuid, startPollingVideoStatus]);

  const handleBack = () => {
    navigate('/videos');
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este vídeo?')) {
      try {
        await deleteVideo(videoUuid);
        navigate('/videos');
      } catch (error) {
        alert('Erro ao excluir vídeo: ' + error.message);
      }
    }
  };

  const handleThumbnailSelect = (frame) => {
    selectFrameAsThumbnail(videoUuid, frame);
    setShowThumbnailSelector(false);
  };

  if (loadingCurrentVideo) {
    return (
      <div className="video-detail-page loading">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Carregando detalhes do vídeo...</p>
        </div>
      </div>
    );
  }

  if (currentVideoError) {
    return (
      <div className="video-detail-page error">
        <div className="error-message">
          <h2>Erro ao carregar vídeo</h2>
          <p>{currentVideoError}</p>
          <button onClick={handleBack} className="back-button">Voltar para a lista de vídeos</button>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="video-detail-page not-found">
        <div className="not-found-message">
          <h2>Vídeo não encontrado</h2>
          <p>O vídeo solicitado não foi encontrado.</p>
          <button onClick={handleBack} className="back-button">Voltar para a lista de vídeos</button>
        </div>
      </div>
    );
  }

  // Define o estilo e mensagem de acordo com o status do vídeo
  const getStatusInfo = () => {
    const statusMap = {
      'UPLOADED': { className: 'status-uploaded', message: 'Enviado' },
      'PROCESSED': { className: 'status-uploading', message: 'Processado' },
      'PROCESSING': { className: 'status-processing', message: 'Processando...' },
      'DONE': { className: 'status-completed', message: 'Concluído' },
    };

    return statusMap[currentVideo.status.toUpperCase()] || { className: '', message: currentVideo.status };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="video-detail-page">
      <div className="detail-header">
        <button onClick={handleBack} className="back-button">
          &larr; Voltar
        </button>
        <h1>{currentVideo.title || 'Vídeo sem título'}</h1>

        {/* Exibe um indicador quando o vídeo estiver em processamento */}
        {['processing', 'uploading'].includes(currentVideo.status?.toLowerCase()) && (
          <div className="processing-indicator">
            <div className="spinner-small"></div>
            <span>Atualizando automaticamente...</span>
          </div>
        )}
      </div>

      <div className="detail-content">

        <div className="video-info-panel">
          <div className="video-info">
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className={statusInfo.className}>
                {statusInfo.message}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span>{currentVideo.name}</span>
            </div>
          </div>

          <div className="video-actions">
            {currentVideo.status === 'DONE' && (
              <a
                href={`${IMAGE_API_URL}/video-zip/${videoUuid}/zip`}
                download={`${currentVideo.title || 'video'}.mp4`}
                className="download-button"
              >
                Baixar Zip do Vídeo
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="video-frames-section">
        {['done', 'ready'].includes(currentVideo.status?.toLowerCase()) ? (
          <VideoFrames videoUuid={videoUuid} />
        ) : (
          <div className="frames-unavailable">
            <p>Os frames estarão disponíveis quando o processamento do vídeo for concluído.</p>
            {['processing', 'uploading'].includes(currentVideo.status?.toLowerCase()) && (
              <div className="spinner"></div>
            )}
          </div>
        )}
      </div>

      {showThumbnailSelector && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ThumbnailSelector
              videoUuid={videoUuid}
              onThumbnailSelected={handleThumbnailSelect}
              onCancel={() => setShowThumbnailSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetailPage;
