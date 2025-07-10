import { useState } from 'react';
import VideoList from '../../components/video/VideoList';
import VideoUpload from '../../components/upload/VideoUpload';
import { useVideoContext } from '../../contexts';
import './VideosPage.css';

const VideosPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Usando o contexto para acessar a função de atualização dos vídeos
  const { refreshData } = useVideoContext();
  
  const handleUploadComplete = () => {
    setShowUploadModal(false);
    // Atualizar os dados usando a função do contexto
    refreshData();
  };
  
  return (
    <div className="videos-page">
      <div className="page-header">
        <h1>Meus Vídeos</h1>
        <button 
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          Novo Upload
        </button>
      </div>
      
      {/* A lista já será atualizada automaticamente pelo contexto */}
      <VideoList />
      
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <VideoUpload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
