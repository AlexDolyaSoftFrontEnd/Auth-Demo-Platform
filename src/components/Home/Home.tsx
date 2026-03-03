// src/components/Home/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { 
  FiCalendar, 
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="home-page">
      {/* Фиксированный левый навбар */}
      <nav className="home-sidebar">
        <div className="home-sidebar__container">
          <div className="home-sidebar__header">
            <img 
              src="https://cdn.dribbble.com/userupload/44970967/file/bb19b75c7489d8dadb8b1b709bb8ee65.png?resize=400x0" 
              alt="Logo" 
              className="home-sidebar__logo" 
            />
          </div>
          
          <ul className="home-sidebar__menu">
            <li className="home-sidebar__menu-item">
              <a href="#calendar">
                <FiCalendar className="home-sidebar__icon" />
                <span>Календарь</span>
              </a>
            </li>
            <li className="home-sidebar__menu-item">
              <a href="#settings">
                <FiSettings className="home-sidebar__icon" />
                <span>Настройки</span>
              </a>
            </li>
          </ul>

          <div className="home-sidebar__footer">
            <div className="home-sidebar__user-info">
              <div className="home-sidebar__avatar">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="home-sidebar__user-email">
                {user?.email}
              </div>
            </div>
            <button onClick={handleLogout} className="home-sidebar__logout-button">
              <FiLogOut className="home-sidebar__logout-icon" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент с отступом под сайдбар */}
      <main className="home-content">
        <div className="home-content__container">
          <div className="home-content__card">
            <h1 className="home-content__title">Добро пожаловать!</h1>
            <p className="home-content__description">
              Вы успешно авторизовались в системе. 
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;