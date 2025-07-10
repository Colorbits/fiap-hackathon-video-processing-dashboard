import { useState } from 'react';
import VideoList from '../../components/video/VideoList';
import VideoUpload from '../../components/upload/VideoUpload';
import { useVideoContext } from '../../contexts';
import './VideosPage.css';

const VideosPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { refreshData } = useVideoContext();

  const handleUploadComplete = () => {
    setShowUploadModal(false);
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
