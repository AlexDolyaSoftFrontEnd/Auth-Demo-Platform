// src/components/Home/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
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
      <header className="home-header">
        <div className="home-header__container">
          <img 
            src="https://igadgetsmart.com/content/images/2/400x200l50nn0/95500910583574.webp" 
            alt="Logo" 
            className="home-header__logo" 
          />
          <button onClick={handleLogout} className="home-header__logout-button">
            Выйти
          </button>
        </div>
      </header>

      <main className="home-content">
        <div className="home-content__container">
          <div className="home-content__card">
            <div className="home-content__avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            
            <h1 className="home-content__title">Добро пожаловать!</h1>
            <p className="home-content__email">{user?.email}</p>
            
            <p className="home-content__description">
              Вы успешно авторизовались в системе. 
            </p>
            <p className="home-content__description">
            Здесь будет располагаться 
            основной функционал платформы для сотрудников.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;