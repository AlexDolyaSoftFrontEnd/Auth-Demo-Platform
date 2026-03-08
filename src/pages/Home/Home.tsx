import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaTimes } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/motohub'); 
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-content">
        <div className="page-card">
          
          <div className="page-card__content">
            <h1 className="page-card__title">
              <FaHome className="page-card__icon" size={24} /> 
              Главная
            </h1>
          </div>

          {/* Крестик справа */}
          <button className="page-card__close-btn" onClick={handleClose} type="button" aria-label="Закрыть" title='Close'>
            <FaTimes size={20} />
          </button>
          
        </div>

        {/* Здесь начинается основной контент страницы... */}
        
      </main>
    </div>
  );
};

export default Home;