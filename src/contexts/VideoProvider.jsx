import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import VideoContext from './VideoContext';
import { videoApiService } from '../services/videoApiService';
import { videoImageService } from '../services/videoImageService';

const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videosError, setVideosError] = useState(null);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoFrames, setVideoFrames] = useState([]);
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [framesError, setFramesError] = useState(null);

  const pollingIntervalRef = useRef(null);

  const loadVideos = useCallback(async () => {
    try {
      setLoadingVideos(true);
      setVideosError(null);

      const fetchedVideos = await videoApiService.fetchUserVideos();
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      setVideosError(error.message || 'Erro ao carregar vídeos');
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  const loadVideoFrames = useCallback(async (videoId) => {
    try {
      setLoadingFrames(true);
      setFramesError(null);

      const frames = await videoImageService.getImagesByVideoUuid(videoId);
      setVideoFrames(frames);
    } catch (error) {
      console.error(`Erro ao carregar frames do vídeo ${videoId}:`, error);
      setFramesError(error.message || 'Erro ao carregar os frames do vídeo');
      return [];
    } finally {
      setLoadingFrames(false);
    }
  }, []);

  const uploadVideo = useCallback(async (userId, formData) => {
    try {
      const uploadedVideo = await videoApiService.uploadVideo(userId, formData);
      setVideos(prevVideos => [uploadedVideo, ...prevVideos]);
      return uploadedVideo;
    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      throw error;
    }
  }, []);

  const deleteVideo = useCallback(async (videoId) => {
    try {
      await videoApiService.deleteVideo(videoId);

      setVideos(prevVideos => prevVideos.filter(video =>
        video.id.toString() !== videoId.toString() && video.uuid !== videoId));

      if (currentVideo && (currentVideo.id.toString() === videoId.toString() || currentVideo.uuid === videoId)) {
        setCurrentVideo(null);
        setVideoFrames([]);
      }

      return true;
    } catch (error) {
      console.error(`Erro ao excluir vídeo ${videoId}:`, error);
      throw error;
    }
  }, [currentVideo]);

  const updateVideoThumbnail = useCallback(async (videoId, imageFile) => {
    try {
      const thumbnail = await videoImageService.generateThumbnail(videoId, imageFile);

      setVideos(prevVideos => prevVideos.map(video => {
        if (video.id.toString() === videoId.toString() || video.uuid === videoId) {
          return {
            ...video,
            thumbnailUrl: videoImageService.getImageUrl(thumbnail.uuid)
          };
        }
        return video;
      }));

      if (currentVideo && (currentVideo.id.toString() === videoId.toString() || currentVideo.uuid === videoId)) {
        setCurrentVideo(prevVideo => ({
          ...prevVideo,
          thumbnailUrl: videoImageService.getImageUrl(thumbnail.uuid)
        }));
      }

      return thumbnail;
    } catch (error) {
      console.error(`Erro ao atualizar thumbnail do vídeo ${videoId}:`, error);
      throw error;
    }
  }, [currentVideo]);

  const selectFrameAsThumbnail = useCallback(async (videoId, frame) => {
    try {
      setVideos(prevVideos => prevVideos.map(video => {
        if (video.id.toString() === videoId.toString() || video.uuid === videoId) {
          return {
            ...video,
            thumbnailUrl: frame.path.startsWith('http')
              ? frame.path
              : videoImageService.getImageUrl(frame.uuid)
          };
        }
        return video;
      }));

      // Se for o vídeo atual, atualiza também
      if (currentVideo && (currentVideo.id.toString() === videoId.toString() || currentVideo.uuid === videoId)) {
        setCurrentVideo(prevVideo => ({
          ...prevVideo,
          thumbnailUrl: frame.path.startsWith('http')
            ? frame.path
            : videoImageService.getImageUrl(frame.uuid)
        }));
      }

      return frame;
    } catch (error) {
      console.error(`Erro ao selecionar frame como thumbnail do vídeo ${videoId}:`, error);
      throw error;
    }
  }, [currentVideo]);

  // Função para atualizar o status de um vídeo específico
  const updateVideoStatus = useCallback(async (videoId, newStatus) => {
    try {
      // Atualize o status do vídeo na lista
      setVideos(prevVideos => prevVideos.map(video => {
        if (video.id.toString() === videoId.toString() || video.uuid === videoId) {
          return { ...video, status: newStatus };
        }
        return video;
      }));

      // Se for o vídeo atual, atualize também
      if (currentVideo && (currentVideo.id.toString() === videoId.toString() || currentVideo.uuid === videoId)) {
        setCurrentVideo(prevVideo => ({
          ...prevVideo,
          status: newStatus
        }));
      }

      return true;
    } catch (error) {
      console.error(`Erro ao atualizar status do vídeo ${videoId}:`, error);
      throw error;
    }
  }, [currentVideo]);

  // Função para iniciar polling para vídeos em processamento
  const startPollingVideoStatus = useCallback((videoId, interval = 5000) => {
    // Limpa qualquer intervalo existente
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Configura novo intervalo para verificação de status
    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Carrega os dados atualizados do vídeo
        const updatedVideo = await videoApiService.fetchVideoById(videoId);

        // Atualiza o vídeo no contexto
        setCurrentVideo(updatedVideo);

        // Se o vídeo não estiver mais em processamento, para o polling
        if (updatedVideo.status !== 'PROCESSING' && updatedVideo.status !== 'UPLOADING') {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;

          // Atualiza o vídeo na lista geral também
          setVideos(prevVideos => prevVideos.map(video => {
            if (video.id.toString() === videoId.toString() || video.uuid === videoId) {
              return updatedVideo;
            }
            return video;
          }));
        }
      } catch (error) {
        console.error('Erro ao verificar status do vídeo:', error);
        // Em caso de erro, também para o polling
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, interval);

    // Retorna função para limpar intervalo
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  // Limpa o intervalo quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  // Função para recarregar todos os dados (útil após operações de atualização)
  const refreshData = useCallback(() => {
    loadVideos();
    if (currentVideo) {
      const videoId = currentVideo.id || currentVideo.uuid;
      loadVideoFrames(videoId);
    }
  }, [loadVideos, loadVideoFrames, currentVideo]);

  // Carrega a lista de vídeos quando o componente é montado
  useEffect(() => {
    loadVideos();
  }, [loadVideos]);


  const processedVideosCount = useMemo(() => {
    return videos.filter(video => video.status === 'DONE').length;
  }, [videos])

  const processingVideosCount = useMemo(() => {
    return videos.filter(video => video.status === 'PROCESSING' || video.status === 'UPLOADING').length;
  }, [videos]);

  const estimatedVideoSizeInMB = useMemo(() => {
    return videos.reduce((total, video) => {
      const size = video?.size || 20048576;
      return total + (size / (1024 * 1024));
    }, 0).toFixed(2);
  }, [videos]);


  const contextValue = {
    videos, // Inverte a ordem para mostrar os mais recentes primeiro
    loadingVideos,
    videosError,
    currentVideo,
    videoFrames,
    loadingFrames,
    framesError,
    processedVideosCount,
    processingVideosCount,
    estimatedVideoSizeInMB,
    loadVideos,
    loadVideoFrames,
    uploadVideo,
    deleteVideo,
    updateVideoThumbnail,
    selectFrameAsThumbnail,
    refreshData,
    setCurrentVideo,
    updateVideoStatus,
    startPollingVideoStatus
  };

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoProvider;
