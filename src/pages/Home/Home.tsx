import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-content">
        <div className="page-card">
          <h1 className="page-card__title">🤷‍♂️ Главная</h1>
          <p className="page-card__description">
            Выберите раздел в меню слева для работы.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;