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

// ============================================
// ЛЕНИВАЯ ЗАГРУЗКА СТРАНИЦ И КОМПОНЕНТОВ
// ============================================

const LoginForm = React.lazy(() => import('./components/LoginForm/LoginForm'));
const Home = React.lazy(() => import('./pages/Home/Home'));
const MotoHub = React.lazy(() => import('./pages/MotoHub/MotoHub'));
const Settings = React.lazy(() => import('./pages/Settings/Settings'));
const TableDemo = React.lazy(() => import('./components/TableDemo/TableDemo'));

// ============================================
// КОМПОНЕНТЫ ЗАГРУЗКИ И ОШИБОК
// ============================================

/**
 * Компонент отображения состояния загрузки страницы
 * Используется как fallback для React.lazy и RouterProvider
 */
const PageLoader: React.FC = () => (
  <div className="page-loader" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true" />
    <p>Загрузка...</p>
  </div>
);

/**
 * Компонент обработки ошибок маршрутов
 * Отображается при ошибке загрузки ленивого компонента или навигации
 */
const RouteErrorBoundary: React.FC = () => (
  <div className="route-error" role="alert">
    <h2>Произошла ошибка</h2>
    <p>Не удалось загрузить страницу</p>
    <button 
      onClick={() => window.location.reload()} 
      type="button"
      className="button-primary"
    >
      Попробовать снова
    </button>
  </div>
);

// ============================================
// ЗАЩИЩЁННЫЙ МАРШРУТ (LAYOUT)
// ============================================

/**
 * Layout-компонент для защиты маршрутов
 * Проверяет авторизацию перед рендером дочерних маршрутов
 * 
 * @returns Outlet для дочерних маршрутов или Navigate на логин
 */
const ProtectedLayout: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  // Если пользователь не авторизован — редирект на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Рендерим дочерние маршруты через Outlet
  return <Outlet />;
};

// ============================================
// КОНФИГУРАЦИЯ МАРШРУТОВ
// ============================================

/**
 * Конфигурация роутера приложения
 * Использует data router API React Router v6.4+
 * 
 * Структура:
 * - Публичные маршруты: /login
 * - Защищённые маршруты: /home, /motohub, /settings, /table-demo
 * - Редиректы: / → /home, * → /home
 */
export const router = createBrowserRouter([
  {
    // Публичный маршрут: страница входа
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
      {
        path: '/table-demo',
        element: <TableDemo />,
      },
    ],
  },
  {
    // Редирект с корневого пути на главную
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    // Обработка неопознанных маршрутов (404)
    // Редирект на главную вместо показа ошибки
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ
// ============================================

/**
 * Корневой компонент приложения
 * 
 * Особенности:
 * - Suspense для ленивой загрузки компонентов
 * - RouterProvider для управления навигацией
 * - Глобальные fallback-элементы для загрузки и ошибок
 * 
*/
const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider 
        router={router} 
        fallbackElement={<PageLoader />} 
      />
    </Suspense>
  );
};

export default App;
