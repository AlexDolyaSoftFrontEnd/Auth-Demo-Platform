import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Calendar.css';

const Calendar: React.FC = () => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-content">
        <div className="page-card">
          <h1 className="page-card__title">📅 Календарь</h1>
          <p className="page-card__description">
            Здесь будет отображаться календарь событий.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Calendar;