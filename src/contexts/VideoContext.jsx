import { createContext,useContext } from 'react';


export const VideoContext = createContext();

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext deve ser usado dentro de um VideoProvider');
  }
  return context;
};
