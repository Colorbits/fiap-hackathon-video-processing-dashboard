import { useState, useEffect } from 'react';
import { useVideoContext } from '../../contexts';
import { videoImageService } from '../../services/videoImageService';
import './VideoFrames.css';

/**
 * Componente para exibir os frames de um vídeo
 * @param {Object} props - Propriedades do componente
 * @param {string} props.videoUuid - UUID do vídeo
 * @param {Function} props.onFrameSelect - Função chamada quando um frame é selecionado
 * @param {boolean} props.selectable - Se os frames podem ser selecionados
 */
const VideoFrames = ({ onFrameSelect, selectable = false }) => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  
  // Usando o contexto para acessar estados e funções relacionadas aos frames
  const { 
    videoFrames, 
    loadingFrames: loading, 
    framesError: error,
  } = useVideoContext();
  
  const handleFrameClick = (frame) => {
    if (!selectable) return;
    
    setSelectedFrame(frame);
    if (onFrameSelect) {
      onFrameSelect(frame);
    }
  };
  
  if (loading) {
    return <div className="frames-loading">Carregando frames...</div>;
  }
  
  if (error) {
    return <div className="frames-error">{error}</div>;
  }
  
  if (!videoFrames || videoFrames.length === 0) {
    return <div className="frames-empty">Nenhum frame disponível para este vídeo.</div>;
  }

  return (
    <div className="video-frames-container">
      <h3>Frames do vídeo</h3>
      <div className="frames-grid">
        {videoFrames.map((frame) => (
          <div 
            key={frame.uuid} 
            className={`frame-item ${selectedFrame === frame ? 'selected' : ''}`}
            onClick={() => handleFrameClick(frame)}
          >
            <div className="frame-image">
              {/* Usando a imagem diretamente do path ou da URL obtida */}
              <img 
                src={videoImageService.getImageUrl(frame.uuid)} 
                alt={`Frame ${frame.filename}`} 
              />
            </div>
            <div className="frame-info">
              <span className="frame-name">{frame.filename}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFrames;
