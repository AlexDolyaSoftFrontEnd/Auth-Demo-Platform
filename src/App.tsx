// src/App.tsx
import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

// Ленивая загрузка компонентов
const LoginForm = React.lazy(() => import('./components/LoginForm/LoginForm'));
const Home = React.lazy(() => import('./pages/Home/Home'));
const MotoHub = React.lazy(() => import('./pages/MotoHub/MotoHub'));
const Settings = React.lazy(() => import('./pages/Settings/Settings'));

// ============================================
// КОМПОНЕНТЫ ЗАГРУЗКИ И ОШИБОК
// ============================================

// Компонент загрузки страницы
const PageLoader: React.FC = () => (
  <div className="page-loader">
    <div className="spinner" aria-hidden="true" />
    <p>Загрузка...</p>
  </div>
);

// Компонент обработки ошибок маршрута
const RouteErrorBoundary: React.FC = () => (
  <div className="route-error">
    <h2>Произошла ошибка</h2>
    <p>Не удалось загрузить страницу</p>
    <button onClick={() => window.location.reload()} type="button">
      Попробовать снова
    </button>
  </div>
);

// ============================================
// ЗАЩИЩЁННЫЙ МАРШРУТ (LAYOUT)
// ============================================

// Layout-компонент для защищённых маршрутов
// Проверяет авторизацию перед рендером дочерних маршрутов
const ProtectedLayout: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Если пользователь не авторизован — редирект на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Рендерим дочерние маршруты через Outlet
  return <Outlet />;
};

// ============================================
// КОНФИГУРАЦИЯ МАРШРУТОВ
// ============================================

// Создаём роутер с использованием data router API (React Router v6.4+)
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    // Группа защищённых маршрутов
    element: <ProtectedLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/motohub',
        element: <MotoHub />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    // Редирект с корневого пути
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    // Обработка неопознанных маршрутов (404)
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ
// ============================================

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} fallbackElement={<PageLoader />} />
    </Suspense>
  );
};

export default App;
