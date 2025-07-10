import { useContext } from 'react';
import VideoContext from './VideoContext';

const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext deve ser usado dentro de um VideoProvider');
  }
  return context;
};

export default useVideoContext;
