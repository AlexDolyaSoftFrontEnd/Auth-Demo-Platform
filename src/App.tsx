// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

// Ленивая загрузка компонентов
const LoginForm = React.lazy(() => import('./components/LoginForm/LoginForm'));
const Home = React.lazy(() => import('./pages/Home/Home'));
const MotoHub = React.lazy(() => import('./pages/MotoHub/MotoHub'));
const Settings = React.lazy(() => import('./pages/Settings/Settings'));

// Компонент загрузки страницы
const PageLoader: React.FC = () => (
  <div className="page-loader">
    <div className="spinner" />
    <p>Загрузка...</p>
  </div>
);

// Защищённый маршрут для аутентифицированных пользователей
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Основной компонент приложения
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Страница входа */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Главная страница */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Раздел мотоциклов */}
          <Route 
            path="/motohub" 
            element={
              <ProtectedRoute>
                <MotoHub />
              </ProtectedRoute>
            } 
          />
          
          {/* Настройки профиля */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Редирект с корневого пути на главную */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Обработка неопознанных маршрутов */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;