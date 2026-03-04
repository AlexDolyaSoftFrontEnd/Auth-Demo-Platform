import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { FiHome, FiCalendar, FiSettings, FiLogOut, FiX, FiUser } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [wasMobileOpen, setWasMobileOpen] = useState(false);

  // Проверка: является ли устройство мобильным
  const isMobile = () => window.innerWidth <= 768;

  // Закрытие меню при изменении маршрута на мобильных
  useEffect(() => {
    if (isMobile()) {
      setIsMobileOpen(false);
    }
  }, [location.pathname]);

  // Управление скроллом body
  useEffect(() => {
    const mobile = isMobile();
    
    if (mobile && isMobileOpen) {
      document.body.style.overflow = 'hidden';
      setWasMobileOpen(true);
    } else if (!mobile && wasMobileOpen) {
      document.body.style.overflow = '';
      setWasMobileOpen(false);
      setIsMobileOpen(false);
    } else if (!isMobileOpen && wasMobileOpen) {
      document.body.style.overflow = '';
      setWasMobileOpen(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, wasMobileOpen]);

  // Обработчик изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile() && isMobileOpen) {
        setIsMobileOpen(false);
        document.body.style.overflow = '';
        setWasMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay для мобильных */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={closeMobileMenu}
        onKeyDown={(e) => e.key === 'Enter' && closeMobileMenu()}
        role="button"
        tabIndex={isMobileOpen ? 0 : -1}
        aria-hidden={!isMobileOpen}
        style={{ pointerEvents: isMobileOpen ? 'auto' : 'none' }}
      />

      {/* Кнопка гамбургер */}
      <button 
        className={`sidebar-toggle ${isMobileOpen ? 'sidebar-toggle--active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label={isMobileOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isMobileOpen}
        aria-controls="sidebar-nav"
      >
        <span className="sidebar-toggle__box">
          <span className="sidebar-toggle__line sidebar-toggle__line--top" />
          <span className="sidebar-toggle__line sidebar-toggle__line--middle" />
          <span className="sidebar-toggle__line sidebar-toggle__line--bottom" />
        </span>
        <FiX className="sidebar-toggle__close-icon" />
      </button>

      {/* Сайдбар */}
      <nav 
        id="sidebar-nav"
        className={`sidebar ${isMobileOpen ? 'sidebar--visible' : ''}`}
        aria-label="Основная навигация"
      >
        <div className="sidebar__container">
          {/* Header с логотипом */}
          <div className="sidebar__header">
            <img 
              src="https://cdn.dribbble.com/userupload/44970967/file/bb19b75c7489d8dadb8b1b709bb8ee65.png?resize=400x0" 
              alt="Logo" 
              className="sidebar__logo" 
            />
          </div>
          
          {/* Навигация */}
          <ul className="sidebar__menu">
            <li className="sidebar__menu-item">
              <NavLink 
                to="/home" 
                className={({ isActive }) => 
                  `sidebar__link ${isActive ? 'active' : ''}`
                }
                end
                onClick={closeMobileMenu}
              >
                <FiHome className="sidebar__icon" />
                <span>Главная</span>
              </NavLink>
            </li>
            
            <li className="sidebar__menu-item">
              <NavLink 
                to="/motohub" 
                className={({ isActive }) => 
                  `sidebar__link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <FiUser className="sidebar__icon" />
                <span>MotoHub</span>
              </NavLink>
            </li>
            
            <li className="sidebar__menu-item">
              <NavLink 
                to="/settings" 
                className={({ isActive }) => 
                  `sidebar__link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <FiSettings className="sidebar__icon" />
                <span>Настройки</span>
              </NavLink>
            </li>
          </ul>

          {/* Footer с профилем и выходом */}
          <div className="sidebar__footer">
            <div className="sidebar__user-info">
              <div className="sidebar__avatar" aria-label="Аватар пользователя">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="sidebar__user-email" title={user?.email}>
                {user?.email}
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="sidebar__logout-button"
              aria-label="Выйти из аккаунта"
            >
              <FiLogOut className="sidebar__logout-icon" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;