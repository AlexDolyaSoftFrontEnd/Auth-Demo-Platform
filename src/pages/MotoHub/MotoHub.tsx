import React, { useReducer, useMemo, useCallback } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { FiStar, FiMapPin, FiDollarSign, FiCalendar, FiHeart, FiEyeOff } from 'react-icons/fi';
import './MotoHub.css';

// ============================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ============================================

// Типы доступных вкладок навигации
type TabType = 'all' | 'recommend' | 'favorite' | 'hidden';

// Типы действий для редьюсера
type MotoAction =
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'SET_BIKES'; payload: MotoBike[] }
  | { type: 'RESET_FILTERS' };

// Интерфейс состояния
interface MotoState {
  activeTab: TabType;
  allBikes: MotoBike[];
}

// Интерфейс данных мотоцикла
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

// ============================================
// РЕДЬЮСЕР ДЛЯ УПРАВЛЕНИЯ СОСТОЯНИЕМ
// ============================================

// Начальное состояние
const initialState: MotoState = {
  activeTab: 'all',
  allBikes: [],
};

// Функция редьюсера — чистая функция, описывающая как меняется состояние
const motoReducer = (state: MotoState, action: MotoAction): MotoState => {
  switch (action.type) {
    case 'SET_TAB':
      // Смена активной вкладки
      return { ...state, activeTab: action.payload };

    case 'SET_BIKES':
      // Обновление списка мотоциклов (например, после загрузки с API)
      return { ...state, allBikes: action.payload };

    case 'RESET_FILTERS':
      // Сброс фильтров к начальному состоянию
      return { ...initialState, allBikes: state.allBikes };

    default:
      // Возвращаем состояние без изменений для неизвестных действий
      return state;
  }
};

// ============================================
// КАСТОМНЫЙ ХУК С useReducer
// ============================================

// Хук для управления состоянием мотоциклов через useReducer
// Возвращает: state, dispatch, filteredBikes, handleTabChange
const useMotoState = (initialData: MotoBike[]) => {
  // Инициализируем редьюсер с начальными данными
  const [state, dispatch] = useReducer(motoReducer, {
    ...initialState,
    allBikes: initialData,
  });

  // Фильтрация мотоциклов на основе активной вкладки
  const filteredBikes = useMemo(() => {
    const { activeTab, allBikes } = state;

    switch (activeTab) {
      case 'recommend':
        // В реальном приложении здесь была бы логика рекомендаций
        return allBikes.filter(bike => bike.id === 1);

      case 'favorite':
        // В упрощённой версии показываем те же рекомендованные
        return allBikes.filter(bike => bike.id === 2 || bike.id === 4);

      case 'hidden':
        // В упрощённой версии показываем один скрытый для примера
        return allBikes.filter(bike => bike.id === 3);

      case 'all':
      default:
        // Все мотоциклы без фильтрации
        return allBikes;
    }
  }, [state]);

  // Обработчик смены вкладки
  const handleTabChange = useCallback((tab: TabType) => {
    dispatch({ type: 'SET_TAB', payload: tab });
  }, []);

  // Сброс всех фильтров
  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return {
    state,
    dispatch,
    filteredBikes,
    handleTabChange,
    resetFilters,
  };
};

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================

const MotoHub: React.FC = () => {
  // Статические данные мотоциклов (в реальности — загрузка из API)
  const initialMotorcycles: MotoBike[] = useMemo(() => [
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
  ], []);

  // Используем кастомный хук с useReducer
  const { state, filteredBikes, handleTabChange } = useMotoState(initialMotorcycles);

  // Рендер контента в зависимости от активной вкладки
  const renderContent = useMemo(() => {
    const commonProps = { bikes: filteredBikes };

    switch (state.activeTab) {
      case 'all':
        return <AllMotorcycles {...commonProps} />;
      case 'recommend':
        return <Recommendations {...commonProps} />;
      case 'favorite':
        return <Favorites {...commonProps} />;
      case 'hidden':
        return <HiddenBikes {...commonProps} />;
      default:
        return null;
    }
  }, [state.activeTab, filteredBikes]);

  return (
    <div className="page-wrapper">
      {/* Боковая панель навигации */}
      <Sidebar />
      
      <main className="page-content">
        {/* Заголовок страницы с мета-информацией */}
        <header className="moto-header">
          <div className="meta-info">
            Гараж 
            <span className="info-icon" title="Информация">🤣</span>
          </div>
          <h1 className="page-title">Мотоциклы</h1>
        </header>

        {/* Навигационные табы с обработчиками кликов */}
        <nav className="tabs-nav">
          <TabButton
            label="Все мотоциклы"
            isActive={state.activeTab === 'all'}
            onClick={() => handleTabChange('all')}
          />
          <TabButton
            label="Рекомендовано"
            icon={<FiStar className="icon-star" />}
            isActive={state.activeTab === 'recommend'}
            onClick={() => handleTabChange('recommend')}
          />
          <TabButton
            label="Избранное"
            icon={<FiHeart className="icon-heart" />}
            isActive={state.activeTab === 'favorite'}
            onClick={() => handleTabChange('favorite')}
          />
          <TabButton
            label="Скрытые"
            icon={<FiEyeOff className="icon-hide" />}
            isActive={state.activeTab === 'hidden'}
            onClick={() => handleTabChange('hidden')}
          />
        </nav>

        {/* Область отображения контента */}
        <div className="content-container">
          {renderContent}
        </div>
      </main>
    </div>
  );
};

// ============================================
// ВСПОМОГАТЕЛЬНЫЙ КОМПОНЕНТ КНОПКИ ТАБА
// ============================================

// Компонент кнопки вкладки с условным рендерингом иконки
// Принимает: label, isActive, onClick, icon (опционально)
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = React.memo(({ label, isActive, onClick, icon }) => (
  <button 
    className={`tab-btn ${isActive ? 'active' : ''}`} 
    onClick={onClick}
    type="button"
    aria-pressed={isActive}
  >
    {icon}
    {label}
  </button>
));

TabButton.displayName = 'TabButton';

// ============================================
// ПОДКОМПОНЕНТЫ ДЛЯ ОТОБРАЖЕНИЯ СПИСКОВ
// ============================================

// Пропсы для компонентов списков
interface MotoListProps {
  bikes: MotoBike[];
}

// Компонент списка всех мотоциклов
const AllMotorcycles: React.FC<MotoListProps> = React.memo(({ bikes }) => (
  <div className="motorcycles-list">
    {bikes.map((moto) => (
      <MotorcycleCard key={moto.id} bike={moto} />
    ))}
  </div>
));

AllMotorcycles.displayName = 'AllMotorcycles';

// Компонент рекомендованных мотоциклов
const Recommendations: React.FC<MotoListProps> = React.memo(({ bikes }) => (
  <div className="recommendations-container">
    <h2 className="section-title">Рекомендовано для вас</h2>
    {bikes.length > 0 ? (
      bikes.map((moto) => <MotorcycleCard key={moto.id} bike={moto} />)
    ) : (
      <EmptyState text="Нет рекомендованных мотоциклов" icon={<FiStar />} />
    )}
  </div>
));

Recommendations.displayName = 'Recommendations';

// Компонент избранных мотоциклов
const Favorites: React.FC<MotoListProps> = React.memo(({ bikes }) => (
  <div className="favorites-container">
    <h2 className="section-title">Избранное</h2>
    {bikes.length > 0 ? (
      bikes.map((moto) => <MotorcycleCard key={moto.id} bike={moto} />)
    ) : (
      <EmptyState text="Вы ещё не добавили ни один мотоцикл в закладки" icon={<FiHeart />} />
    )}
  </div>
));

Favorites.displayName = 'Favorites';

// Компонент скрытых мотоциклов
const HiddenBikes: React.FC<MotoListProps> = React.memo(({ bikes }) => (
  <div className="hidden-bikes-container">
    <h2 className="section-title">Скрытые мотоциклы</h2>
    {bikes.length > 0 ? (
      bikes.map((moto) => <MotorcycleCard key={moto.id} bike={moto} />)
    ) : (
      <EmptyState text="У вас нет скрытых мотоциклов" icon={<FiEyeOff />} />
    )}
  </div>
));

HiddenBikes.displayName = 'HiddenBikes';

// ============================================
// КАРТОЧКА МОТОЦИКЛА (УПРОЩЁННАЯ)
// ============================================

// Пропсы для карточки мотоцикла
interface MotorcycleCardProps {
  bike: MotoBike;
}

// Универсальная карточка мотоцикла без кнопок действий
const MotorcycleCard: React.FC<MotorcycleCardProps> = React.memo(({ bike }) => (
  <article className="motorcycle-card">
    <div className="motorcycle-card__top">
      <h3 className="motorcycle-card__title">{bike.title}</h3>
      <span className="motorcycle-card__category" aria-label={`Категория: ${bike.category}`}>
        {bike.category}
      </span>
    </div>
    
    <div className="motorcycle-card__brand">{bike.brand}</div>
    
    <div className="motorcycle-card__details">
      <DetailItem icon={<FiDollarSign />} text={bike.price} />
      <DetailItem icon={<FiCalendar />} text={`${bike.year} г.`} />
      <span className="detail-item mileage">{bike.mileage}</span>
      <DetailItem icon={<FiMapPin />} text={bike.location} />
    </div>
  </article>
));

MotorcycleCard.displayName = 'MotorcycleCard';

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================

// Компонент отдельного элемента детали с иконкой
interface DetailItemProps {
  icon: React.ReactNode;
  text: string;
}

const DetailItem: React.FC<DetailItemProps> = React.memo(({ icon, text }) => (
  <span className="detail-item">
    <span className="detail-icon" aria-hidden="true">{icon}</span>
    {text}
  </span>
));

DetailItem.displayName = 'DetailItem';

// Компонент пустого состояния с иконкой и сообщением
interface EmptyStateProps {
  text: string;
  icon: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({ text, icon }) => (
  <div className="empty-state" role="status">
    <div className="empty-state__icon" aria-hidden="true">{icon}</div>
    <p className="empty-state__text">{text}</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

export default MotoHub;