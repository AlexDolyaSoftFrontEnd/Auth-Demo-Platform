import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-content">
        <div className="page-card">
          <h1 className="page-card__title">⚙️ Настройки</h1>
          <p className="page-card__description">
            Здесь пользователь сможет управлять настройками профиля.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;