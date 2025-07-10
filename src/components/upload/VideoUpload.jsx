import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoContext } from '../../contexts';
import './VideoUpload.css';

const VideoUpload = ({ onUploadComplete }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState(null);

  // Usando o contexto para acessar a função de upload
  const { uploadVideo } = useVideoContext();

  useEffect(() => {
    // Limpar estados quando o componente é montado
    return () => {
      setFile(null);
      setUploading(false);
      setError(null);
      setProgress(0);
      setUploadSuccess(false);
      setUploadedVideoId(null);
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Por favor, selecione um arquivo de vídeo');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadSuccess(false);

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          return prevProgress >= 90 ? 90 : prevProgress + 5;
        });
      }, 300);

      const formData = new FormData();
      formData.append('file', file);

      const user = JSON.parse(localStorage.getItem('user'));
      const uploadedVideo = await uploadVideo(user?.id, formData);

      clearInterval(progressInterval);
      setProgress(100);
      setUploadSuccess(true);

      setUploadedVideoId(uploadedVideo.id || uploadedVideo.uuid);

      if (onUploadComplete) {
        onUploadComplete(uploadedVideo);
      }

      setFile(null);


    } catch (err) {
      setError(err.message || 'Falha ao fazer upload do vídeo');
      setUploading(false);
      setProgress(0);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="video-upload-container">
      <h2>Upload de Vídeo</h2>

      {error && (
        <div className="upload-error">
          <span className="error-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="upload-success">
          <span className="success-icon">✓</span>
          <span>Upload concluído com sucesso! Redirecionando...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="video-file">Arquivo de Vídeo:</label>
          <input
            type="file"
            id="video-file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
            required
          />
          {file && (
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {uploading && (
          <div className="progress-container">
            <div className="progress-info">
              <span>Enviando vídeo...</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="upload-note">
              {progress < 100 ?
                "O upload pode levar alguns minutos dependendo do tamanho do arquivo." :
                "Processamento concluído! Redirecionando..."
              }
            </p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              if (onUploadComplete) {
                onUploadComplete();
              } else {
                navigate('/videos');
              }
            }}
            disabled={uploading}
          >
            {uploadSuccess ? 'Voltar' : 'Cancelar'}
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={!file || uploading || uploadSuccess}
          >
            {uploading ? 'Enviando...' : 'Fazer Upload'}
          </button>
        </div>

        {uploadedVideoId && uploadSuccess && (
          <div className="view-link">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate(`/videos/${uploadedVideoId}`)}
            >
              Ver vídeo enviado
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoUpload;
