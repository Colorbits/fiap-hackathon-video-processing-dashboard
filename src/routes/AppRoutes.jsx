import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import VideosPage from '../pages/videos/VideosPage';
import VideoDetailPage from '../pages/videoDetail/VideoDetailPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import VideoUpload from '../components/upload/VideoUpload';
import MainLayout from '../components/layout/MainLayout';

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Componente para rotas protegidas
const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Componente para rotas públicas (acessíveis apenas quando não autenticado)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente para página de upload
const UploadPage = () => {
  return (
    <div className="upload-page">
      <h1>Upload de Vídeo</h1>
      <VideoUpload />
    </div>
  );
};

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: 'videos',
            element: <VideosPage />
          },
          {
            path: 'videos/:videoUuid',
            element: <VideoDetailPage />
          },
          {
            path: 'upload',
            element: <UploadPage />
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
