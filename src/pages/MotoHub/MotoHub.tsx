import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { FiStar, FiMapPin, FiDollarSign, FiCalendar, FiHeart, FiEyeOff } from 'react-icons/fi';
import './MotoHub.css';

// Типы вкладок
type TabType = 'all' | 'recommend' | 'favorite' | 'hidden';

// Интерфейс мотоцикла
interface MotoBike {
  id: number;
  title: string;
  brand: string;
  year: number;
  price: string;
  mileage: string;
  location: string;
  category: 'street' | 'sport' | 'cruiser' | 'enduro' | 'touring';
}

const MotoHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Данные мотоциклов
  const motorcycles: MotoBike[] = [
    {
      id: 1,
      title: 'Harley-Davidson Iron 883',
      brand: 'Harley-Davidson',
      year: 2022,
      price: '$12,500',
      mileage: '3,200 км',
      location: 'Киев, Украина',
      category: 'cruiser',
    },
    {
      id: 2,
      title: 'Yamaha R1',
      brand: 'Yamaha',
      year: 2023,
      price: '$18,000',
      mileage: '1,500 км',
      location: 'Львов, Украина',
      category: 'sport',
    },
    {
      id: 3,
      title: 'BMW R 1250 GS',
      brand: 'BMW',
      year: 2021,
      price: '$21,000',
      mileage: '8,900 км',
      location: 'Одесса, Украина',
      category: 'touring',
    },
    {
      id: 4,
      title: 'Kawasaki Ninja 400',
      brand: 'Kawasaki',
      year: 2023,
      price: '$6,500',
      mileage: '500 км',
      location: 'Харьков, Украина',
      category: 'sport',
    },
    {
      id: 5,
      title: 'Ducati Monster 821',
      brand: 'Ducati',
      year: 2020,
      price: '$13,200',
      mileage: '12,000 км',
      location: 'Днепр, Украина',
      category: 'street',
    },
  ];

  // Рендер контента по активной вкладке
  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllMotorcycles bikes={motorcycles} />;
      case 'recommend':
        return <Recommendations bikes={motorcycles.filter(b => b.id === 1)} />;
      case 'favorite':
        return <Favorites bikes={motorcycles.filter(b => b.id === 2 || b.id === 4)} />;
      case 'hidden':
        return <HiddenBikes bikes={motorcycles.filter(b => b.id === 3)} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      
      <main className="page-content">
        {/* Главный заголовок */}
        <header className="moto-header">
          <div className="meta-info">
            Гараж 
            <span className="info-icon" title="Информация">🤣</span>
          </div>
          <h1 className="page-title">Мотоциклы</h1>
        </header>

        {/* Навигационные табы */}
        <nav className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            Все мотоциклы
          </button>

          <button 
            className={`tab-btn ${activeTab === 'recommend' ? 'active' : ''}`} 
            onClick={() => setActiveTab('recommend')}
          >
            <FiStar className="icon-star" /> Рекомендовано
          </button>

          <button 
            className={`tab-btn ${activeTab === 'favorite' ? 'active' : ''}`} 
            onClick={() => setActiveTab('favorite')}
          >
            <FiHeart className="icon-heart" /> Избранное
          </button>

          <button 
            className={`tab-btn ${activeTab === 'hidden' ? 'active' : ''}`} 
            onClick={() => setActiveTab('hidden')}
          >
            <FiEyeOff className="icon-hide" /> Скрытые
          </button>
        </nav>

        {/* Контентная область */}
        <div className="content-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// ===== Подкомпоненты =====

const AllMotorcycles: React.FC<{ bikes: MotoBike[] }> = ({ bikes }) => (
  <div className="motorcycles-list">
    {bikes.map((moto) => (
      <div key={moto.id} className="motorcycle-card">
        <div className="motorcycle-card__top">
          <div className="motorcycle-card__title">{moto.title}</div>
          <span className="motorcycle-card__category">{moto.category}</span>
        </div>
        <div className="motorcycle-card__brand">{moto.brand}</div>
        <div className="motorcycle-card__details">
          <span className="detail-item">
            <FiDollarSign className="detail-icon" />
            {moto.price}
          </span>
          <span className="detail-item">
            <FiCalendar className="detail-icon" />
            {moto.year} г.
          </span>
          <span className="detail-item mileage">
            {moto.mileage}
          </span>
          <span className="detail-item">
            <FiMapPin className="detail-icon" />
            {moto.location}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const Recommendations: React.FC<{ bikes: MotoBike[] }> = ({ bikes }) => (
  <div className="recommendations-container">
    <h2 className="section-title">Рекомендовано для вас</h2>
    {bikes.length > 0 ? (
      bikes.map((moto) => <MotorcycleCard key={moto.id} bike={moto} />)
    ) : (
      <EmptyState text="Нет рекомендованных мотоциклов" icon={<FiStar />} />
    )}
  </div>
);

const Favorites: React.FC<{ bikes: MotoBike[] }> = ({ bikes }) => (
  <div className="favorites-container">
    <h2 className="section-title">Избранное</h2>
    {bikes.length > 0 ? (
      bikes.map((moto) => <MotorcycleCard key={moto.id} bike={moto} />)
    ) : (
      <EmptyState text="Вы ещё не добавили ни один мотоцикл в закладки" icon={<FiHeart />} />
    )}
  </div>
);

const HiddenBikes: React.FC<{ bikes: MotoBike[] }> = ({ bikes }) => (
  <div className="hidden-bikes-container">
    <h2 className="section-title">Скрытые мотоциклы</h2>
    {bikes.length > 0 ? (
      bikes.map((moto) => <MotorcycleCard key={moto.id} bike={moto} />)
    ) : (
      <EmptyState text="У вас нет скрытых мотоциклов" icon={<FiEyeOff />} />
    )}
  </div>
);

// Карточка мотоцикла
const MotorcycleCard: React.FC<{ bike: MotoBike }> = ({ bike }) => (
  <div className="motorcycle-card">
    <div className="motorcycle-card__top">
      <div className="motorcycle-card__title">{bike.title}</div>
      <span className="motorcycle-card__category">{bike.category}</span>
    </div>
    <div className="motorcycle-card__brand">{bike.brand}</div>
    <div className="motorcycle-card__details">
      <span className="detail-item">
        <FiDollarSign className="detail-icon" />
        {bike.price}
      </span>
      <span className="detail-item">
        <FiCalendar className="detail-icon" />
        {bike.year} г.
      </span>
      <span className="detail-item mileage">
        {bike.mileage}
      </span>
      <span className="detail-item">
        <FiMapPin className="detail-icon" />
        {bike.location}
      </span>
    </div>
  </div>
);

// Пустое состояние
const EmptyState: React.FC<{ text: string; icon: React.ReactNode }> = ({ text, icon }) => (
  <div className="empty-state">
    <div className="empty-state__icon">{icon}</div>
    <p className="empty-state__text">{text}</p>
  </div>
);

export default MotoHub;