import { useState } from 'react';
import { videoImageService } from '../../services/videoImageService';
import './ThumbnailSelector.css';
import VideoFrames from './VideoFrames';

/**
 * Componente para selecionar ou fazer upload de uma thumbnail para um vídeo
 * @param {Object} props - Propriedades do componente
 * @param {string} props.videoUuid - UUID do vídeo
 * @param {Function} props.onThumbnailSelected - Função chamada quando uma thumbnail é selecionada
 * @param {Function} props.onCancel - Função chamada quando o usuário cancela a operação
 */
const ThumbnailSelector = ({ videoUuid, onThumbnailSelected, onCancel }) => {
  const [uploadMode, setUploadMode] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Criar preview da imagem selecionada
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleFrameSelect = async (frame) => {
    try {
      setLoading(true);
      setError(null);
      
      // Como o frame já é uma imagem existente, podemos apenas informar que foi selecionado
      if (onThumbnailSelected) {
        onThumbnailSelected(frame);
      }
    } catch (err) {
      setError('Erro ao selecionar frame como thumbnail.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione uma imagem para fazer upload.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const uploadedImage = await videoImageService.uploadImage(videoUuid, file);
      
      if (onThumbnailSelected) {
        onThumbnailSelected(uploadedImage);
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="thumbnail-selector-container">
      <div className="selector-header">
        <h2>Selecione uma thumbnail</h2>
        <div className="selector-tabs">
          <button 
            className={!uploadMode ? 'active' : ''} 
            onClick={() => setUploadMode(false)}
          >
            Selecionar frame
          </button>
          <button 
            className={uploadMode ? 'active' : ''} 
            onClick={() => setUploadMode(true)}
          >
            Fazer upload
          </button>
        </div>
      </div>
      
      {error && (
        <div className="selector-error">{error}</div>
      )}
      
      {uploadMode ? (
        <div className="upload-section">
          <div className="upload-input">
            <label htmlFor="thumbnail-upload">Selecione uma imagem:</label>
            <input 
              type="file" 
              id="thumbnail-upload" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
          
          {preview && (
            <div className="upload-preview">
              <h3>Preview</h3>
              <img src={preview} alt="Preview da thumbnail" />
            </div>
          )}
          
          <div className="selector-actions">
            <button 
              className="cancel-button" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              className="select-button" 
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? 'Enviando...' : 'Usar esta imagem'}
            </button>
          </div>
        </div>
      ) : (
        <div className="frames-section">
          <VideoFrames 
            videoUuid={videoUuid} 
            onFrameSelect={handleFrameSelect} 
            selectable={true}
          />
          
          <div className="selector-actions">
            <button 
              className="cancel-button" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailSelector;
