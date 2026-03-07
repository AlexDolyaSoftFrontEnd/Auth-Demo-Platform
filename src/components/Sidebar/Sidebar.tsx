import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { FiHome, FiSettings, FiLogOut, FiX, FiUser, FiMenu } from 'react-icons/fi';
import './Sidebar.css';

// ============================================
// КАСТОМНЫЕ ХУКИ
// ============================================

// Хук для отслеживания медиа-запроса
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Функция обновления состояния
    const updateMatch = () => setMatches(media.matches);
    
    // Подписываемся на изменения
    media.addEventListener('change', updateMatch);
    updateMatch(); // начальное значение
    
    // Очистка при размонтировании
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
};

// Хук для блокировки скролла тела документа
const useLockBodyScroll = (locked: boolean): void => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    if (locked) {
      // Сохраняем ширину скроллбара для компенсации
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    }
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [locked]);
};

// ============================================
// КОНФИГУРАЦИЯ НАВИГАЦИИ
// ============================================

// Тип для элемента навигации
interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

// Массив элементов навигации
const NAV_ITEMS: NavItem[] = [
  {
    to: '/home',
    label: 'Главная',
    icon: <FiHome />,
    end: true,
  },
  {
    to: '/motohub',
    label: 'MotoHub',
    icon: <FiUser />,
  },
  {
    to: '/settings',
    label: 'Настройки',
    icon: <FiSettings />,
  },
];

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================

const Sidebar: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Отслеживаем мобильный брейкпоинт через медиа-запрос
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Блокируем скролл тела при открытом мобильном меню
  useLockBodyScroll(isMobile && isMobileMenuOpen);

  // Закрываем мобильное меню при смене маршрута
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Закрываем меню при переходе с мобильного на десктоп
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Обработчик выхода из аккаунта
  const handleLogout = useCallback(() => {
    try {
      dispatch(logout());
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]);

  // Переключение мобильного меню
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Закрытие мобильного меню
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Мемоизируем аватар пользователя
  const userAvatar = useMemo(() => {
    return user?.email?.charAt(0).toUpperCase() || 'U';
  }, [user?.email]);

  return (
    <>
      {/* Overlay для мобильных — затемнение фона */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileMenuOpen ? 'sidebar-overlay--visible' : ''}`}
          onClick={closeMobileMenu}
          onKeyDown={(e) => e.key === 'Enter' && closeMobileMenu()}
          role="button"
          tabIndex={isMobileMenuOpen ? 0 : -1}
          aria-hidden={!isMobileMenuOpen}
          aria-label="Закрыть меню"
        />
      )}

      {/* Кнопка гамбургер — только на мобильных */}
      {isMobile && (
        <button 
          className={`sidebar-toggle ${isMobileMenuOpen ? 'sidebar-toggle--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar-nav"
          type="button"
        >
          <span className="sidebar-toggle__icon-wrapper">
            <FiMenu className="sidebar-toggle__icon--open" aria-hidden="true" />
          </span>
        </button>
      )}

      {/* Сайдбар */}
      <nav 
        id="sidebar-nav"
        className={`sidebar ${isMobileMenuOpen ? 'sidebar--visible' : ''} ${isMobile ? 'sidebar--mobile' : 'sidebar--desktop'}`}
        aria-label="Основная навигация"
      >
        <div className="sidebar__container">
          {/* Header с логотипом */}
          <header className="sidebar__header">
            <img 
              src="https://cdn.dribbble.com/userupload/44970967/file/bb19b75c7489d8dadb8b1b709bb8ee65.png?resize=400x0" 
              alt="MotoHub Logo" 
              className="sidebar__logo"
              loading="lazy"
            />
          </header>
          
          {/* Навигационное меню */}
          <ul className="sidebar__menu" role="menubar">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="sidebar__menu-item" role="none">
                <NavLink 
                  to={item.to}
                  className={({ isActive }) => 
                    `sidebar__link ${isActive ? 'active' : ''}`
                  }
                  end={item.end}
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  <span className="sidebar__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="sidebar__label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Footer с профилем и кнопкой выхода */}
          <footer className="sidebar__footer">
            <div className="sidebar__user-info">
              <div 
                className="sidebar__avatar" 
                aria-label={`Пользователь: ${user?.email || 'Гость'}`}
              >
                {userAvatar}
              </div>
              <div 
                className="sidebar__user-email" 
                title={user?.email}
                aria-label={`Email: ${user?.email}`}
              >
                {user?.email}
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="sidebar__logout-button"
              aria-label="Выйти из аккаунта"
              type="button"
            >
              <FiLogOut className="sidebar__logout-icon" aria-hidden="true" />
              <span className="sidebar__logout-label">Выйти</span>
            </button>
          </footer>
        </div>
      </nav>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
