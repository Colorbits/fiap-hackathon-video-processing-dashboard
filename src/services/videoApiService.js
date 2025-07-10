import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


class VideoApiService {
  /**
   * Busca todos os vídeos do usuário
   * @returns {Promise<Array>} Lista de vídeos
   */
  async fetchUserVideos() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (apiError) {
      console.log('Falha na API:', apiError);

      // Log detalhado para depuração de problemas com a API
      if (axios.isAxiosError(apiError)) {
        if (apiError.code === 'ECONNABORTED') {
          console.log('A requisição excedeu o tempo limite (timeout)');
        } else if (apiError.response) {
          // A requisição foi feita e o servidor respondeu com status de erro
          console.log(`Erro ${apiError.response.status}: ${apiError.response.statusText}`);
        } else if (apiError.request) {
          // A requisição foi feita mas não houve resposta
          console.log('Sem resposta do servidor - possível erro de CORS ou API indisponível');
        } else {
          console.log('Erro na configuração da requisição', apiError.message);
        }
      }

      throw apiError; // Propaga o erro para ser tratado pelo componente
    }
  }

  /**
   * Envia um novo vídeo para processamento
   * @param {FormData} formData - FormData contendo o arquivo de vídeo e metadados
   * @returns {Promise<Object>} Dados do vídeo criado
   */
  async uploadVideo(userId, formData) {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_URL}/videos/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (apiError) {
      console.log('Erro no upload de vídeo:', apiError);
    }
  }

  /**
   * Exclui um vídeo específico
   * @param {string|number} videoId - ID do vídeo a ser excluído
   * @returns {Promise<Object>} Resultado da operação
   */
  async deleteVideo(videoId) {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${API_URL}/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      return response.data;
    } catch (apiError) {
      console.log('Erro ao excluir vídeo:', apiError);
    }
  }
}

// Exporta uma instância única do serviço
export const videoApiService = new VideoApiService();
