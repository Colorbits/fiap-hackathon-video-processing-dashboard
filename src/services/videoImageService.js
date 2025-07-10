import axios from 'axios';

// URL base da API de imagens
const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL;

/**
 * Classe para gerenciar todas as chamadas à API relacionadas às imagens de vídeos
 */
class VideoImageService {
  /**
   * Faz o upload de uma imagem para um vídeo específico
   * @param {string} videoUuid - UUID do vídeo para o qual a imagem será associada
   * @param {File} imageFile - Arquivo de imagem a ser enviado
   * @returns {Promise<Object>} - Dados da imagem criada
   */
  async uploadImage(videoUuid, imageFile) {
    const token = localStorage.getItem('token');
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(`${IMAGE_API_URL}/images/${videoUuid}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
          // Não incluir Content-Type aqui pois o axios com FormData define automaticamente
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Progresso do upload de imagem: ${percentCompleted}%`);
        }
      });

      return response.data;
    } catch (apiError) {
      console.error('Erro no upload de imagem:', apiError);
    }
  }

  /**
   * Obtém uma imagem específica por seu UUID
   * @param {string} imageUuid - UUID da imagem
   * @returns {Promise<string>} - URL da imagem
   */
  getImageUrl(imageUuid) {
    // Essa função apenas constrói a URL, não faz requisição, então permanece igual
    return `${IMAGE_API_URL}/images/${imageUuid}`;
  }

  /**
   * Obtém imagem associada a um vídeo específico
   * @param {string} videoUuid - UUID do vídeo
   * @returns {Promise<Object>} - Dados da imagem
   */
  async getImagesByVideoUuid(videoUuid) {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`${IMAGE_API_URL}/video-zip/${videoUuid}/images`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 5000
      });

      return response.data;
    } catch (apiError) {
      console.error('Erro ao obter imagem do vídeo:', apiError);
    }
  }

  /**
   * Obtém múltiplas imagens (frames) de um vídeo específico
   * @param {string} videoUuid - UUID do vídeo
   * @returns {Promise<Array>} - Lista de imagens
   */
  async getVideoFrames(videoUuid) {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`${IMAGE_API_URL}/video-zip/${videoUuid}/images`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 5000
      });
      
      return response.data;
    } catch (apiError) {
      console.error('Erro ao obter frames do vídeo:', apiError);
    }
  }
  
  /**
   * Gera uma thumbnail para um vídeo específico
   * @param {string} videoUuid - UUID do vídeo
   * @param {File|null} imageFile - Arquivo de imagem opcional para usar como thumbnail
   * @returns {Promise<Object>} - Dados da thumbnail gerada
   */
  async generateThumbnail(videoUuid, imageFile = null) {
    const token = localStorage.getItem('token');
    
    try {
      // Se uma imagem foi fornecida, usamos ela como thumbnail
      if (imageFile) {
        return this.uploadImage(videoUuid, imageFile);
      }
      
      // Caso contrário, solicitamos ao servidor para gerar uma thumbnail automaticamente
      const response = await axios.post(`${IMAGE_API_URL}/thumbnails/generate/${videoUuid}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      return response.data;
    } catch (apiError) {
      console.error('Erro ao gerar thumbnail:', apiError);
      
      if (axios.isAxiosError(apiError)) {
        if (apiError.response) {
          throw new Error(`Falha ao gerar thumbnail: ${apiError.response.status}`);
        } else if (apiError.request) {
          throw new Error('Servidor indisponível. Tente novamente mais tarde.');
        }
      }
      
      throw new Error('Não foi possível gerar a thumbnail para este vídeo.');
    }
  }

  /**
   * Exclui uma imagem específica
   * @param {string} imageUuid - UUID da imagem a ser excluída
   * @returns {Promise<Object>} - Resultado da operação
   */
  async deleteImage(imageUuid) {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.delete(`${IMAGE_API_URL}/images/${imageUuid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      return response.data;
    } catch (apiError) {
      console.error('Erro ao excluir imagem:', apiError);
      
      if (axios.isAxiosError(apiError)) {
        if (apiError.response) {
          throw new Error(`Falha ao excluir imagem: ${apiError.response.status}`);
        } else if (apiError.request) {
          throw new Error('Servidor indisponível. Tente novamente mais tarde.');
        }
      }
      
      throw new Error('Não foi possível excluir a imagem.');
    }
  }
}

// Exporta uma instância única do serviço
export const videoImageService = new VideoImageService();
