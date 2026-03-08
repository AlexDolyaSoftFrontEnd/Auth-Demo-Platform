// src/components/Sidebar/Sidebar.tsx
// ============================================
// КОМПОНЕНТ БОКОВОЙ ПАНЕЛИ НАВИГАЦИИ
// ============================================
// Назначение: Адаптивный сайдбар с мобильным меню в стиле Apple
// Особенности:
// - Автоматическое переключение мобильной/десктоп версии
// - Блокировка скролла при открытом меню на мобильных
// - Доступность: ARIA-атрибуты, клавиатурная навигация
// - Оптимизация: React.memo, useCallback, useMemo
// ============================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { FiHome, FiSettings, FiLogOut, FiUser, FiTable } from 'react-icons/fi';
import './Sidebar.css';

// ============================================
// КАСТОМНЫЕ ХУКИ ДЛЯ ПОВТОРНОГО ИСПОЛЬЗОВАНИЯ
// ============================================

/**
 * Хук для отслеживания изменения медиа-запроса
 * @param query - строка медиа-запроса, например '(max-width: 768px)'
 * @returns boolean - соответствует ли текущий экран запросу
 * 
 * Использование: Отслеживание мобильного брейкпоинта для адаптивного поведения
 */
const useMediaQuery = (query: string): boolean => {
  // Инициализируем состояние значением при первом рендере (избегаем гидратации)
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    // Создаём объект MediaQueryList для прослушивания изменений
    const media = window.matchMedia(query);
    
    // Функция-обработчик: обновляет состояние при изменении соответствия запросу
    const updateMatch = () => setMatches(media.matches);
    
    // Подписываемся на событие изменения медиа-запроса
    media.addEventListener('change', updateMatch);
    
    // Обновляем состояние при монтировании (на случай изменения во время SSR)
    updateMatch();
    
    // Очистка: отписываемся от события при размонтировании компонента
    return () => media.removeEventListener('change', updateMatch);
  }, [query]); // Пересоздаём подписку только при изменении самого запроса

  return matches;
};

/**
 * Хук для блокировки прокрутки body при открытом модальном меню
 * @param locked - флаг: блокировать ли скролл
 * 
 * Использование: Предотвращение прокрутки фона при открытом мобильном меню
 * Особенность: Компенсирует ширину скроллбара, чтобы контент не "прыгал"
 */
const useLockBodyScroll = (locked: boolean): void => {
  useEffect(() => {
    // Сохраняем исходные значения стилей body для восстановления позже
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    if (locked) {
      // Вычисляем ширину скроллбара (разница между полной шириной и контентной)
      // Это нужно, чтобы при скрытии скролла контент не смещался вправо
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Блокируем вертикальную прокрутку
      document.body.style.overflow = 'hidden';
      
      // Компенсируем исчезновение скроллбара добавлением отступа справа
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Восстанавливаем исходные значения стилей
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    }
    
    // Функция очистки: гарантированно восстанавливаем стили при размонтировании
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [locked]); // Эффект срабатывает только при изменении флага locked
};

// ============================================
// КОНФИГУРАЦИЯ НАВИГАЦИИ (ВЫНЕСЕНА ОТДЕЛЬНО)
// ============================================

/**
 * Тип данных для элемента навигационного меню
 * to - путь для React Router
 * label - текст ссылки, отображаемый пользователю
 * icon - иконка компонента (React.ReactNode)
 * end - флаг для точного соответствия маршрута (только для корня)
 */
interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

/**
 * Массив конфигурации пунктов меню
 * Преимущество: Легко добавлять/удалять пункты без изменения логики рендера
 * Типизация: Ошибки в путях или пропсах будут пойманы на этапе компиляции
 */
const NAV_ITEMS: NavItem[] = [
  { 
    to: '/home', 
    label: 'Home', 
    icon: <FiHome />, 
    end: true 
  },
  { 
    to: '/motohub', 
    label: 'Moto', 
    icon: <FiUser /> 
  },
  { 
    to: '/table-demo', 
    label: 'Table', 
    icon: <FiTable /> 
  },
  { 
    to: '/settings', 
    label: 'Settings', 
    icon: <FiSettings /> 
  },
];

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ SIDEBAR
// ============================================

/**
 * Компонент боковой панели навигации
 * 
 * Функциональность:
 * - Десктоп: Всегда видимая панель слева
 * - Мобильные: Скрытая панель, открывается кнопкой-гамбургером
 * - Доступность: Полная поддержка ARIA и клавиатурной навигации
 * - Производительность: Оптимизирован с React.memo и хуками
 * 
 * @returns JSX.Element - разметка сайдбара
 */
const Sidebar: React.FC = React.memo(() => {
  // Хуки React Router для навигации и отслеживания текущего пути
  const navigate = useNavigate();
  const location = useLocation();
  
  // Хук Redux для диспатча действий и доступа к стейту
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Отслеживаем, является ли устройство мобильным (ширина <= 768px)
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Состояние: открыто ли мобильное меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Блокируем скролл body, когда мобильное меню открыто
  // Предотвращает прокрутку фона при открытом оверлее
  useLockBodyScroll(isMobile && isMobileMenuOpen);

  // Эффект: Закрываем мобильное меню при переходе на новый маршрут
  // Полезно: пользователь не останется с открытым меню после клика по ссылке
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]); // Зависимости: путь изменился ИЛИ устройство стало мобильным

  // Эффект: Если пользователь изменил размер окна с мобильного на десктоп — закрываем меню
  // Предотвращает "залипание" открытого меню при повороте планшета или изменении размера окна
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]); // Срабатывает при изменении любого из двух значений

  /**
   * Обработчик выхода из аккаунта
   * - Диспатчит действие logout в Redux
   * - Перенаправляет на страницу логина
   * - Обрабатывает ошибки, чтобы приложение не падало
   */
  const handleLogout = useCallback(() => {
    try {
      dispatch(logout());
      // replace: true — заменяет текущую запись в истории, чтобы нельзя было вернуться назад кнопкой "Назад"
      navigate('/login', { replace: true });
    } catch (error) {
      // Логирование ошибки для отладки
      console.error('Ошибка при выходе:', error);
      // Даже при ошибке перенаправляем на логин — безопасность прежде всего
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]); // Зависимости стабильны, функция не пересоздаётся при ререндерах

  /**
   * Переключение состояния мобильного меню
   * Использует функциональное обновление стейта для избежания устаревших значений
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []); // Пустой массив зависимостей — функция создаётся один раз

  /**
   * Принудительное закрытие мобильного меню
   * Используется при клике на оверлей или пункт меню
   */
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Мемоизированный аватар пользователя
   * Вычисляется только при изменении email, не при каждом рендере
   * Если email нет — показываем заглушку 'U'
   */
  const userAvatar = useMemo(() => {
    return user?.email?.charAt(0).toUpperCase() || 'U';
  }, [user?.email]); // Пересчитываем только если изменился email

  // ============================================
  // РЕНДЕР КОМПОНЕНТА
  // ============================================
  return (
    <>
      {/* 
        OVERLAY ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
        - Затемняет фон при открытом меню
        - Клик по оверлею закрывает меню
        - Доступность: role="button", tabIndex, aria-label для скринридеров
        - pointerEvents: none когда скрыт, чтобы не перехватывать клики
      */}
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

      {/* 
        КНОПКА-ГАМБУРГЕР (только на мобильных)
        - Появляется только на экранах <= 768px
        - Анимация превращения в крестик при открытии
        - Доступность: aria-expanded, aria-controls, aria-label
      */}
      {isMobile && (
        <button 
          className={`sidebar-toggle ${isMobileMenuOpen ? 'sidebar-toggle--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar-nav"
          type="button"
        >
          {/* Контейнер для анимированных линий гамбургера */}
          <span className="sidebar-toggle__icon" aria-hidden="true">
            <span className="sidebar-toggle__line sidebar-toggle__line--top" />
            <span className="sidebar-toggle__line sidebar-toggle__line--middle" />
            <span className="sidebar-toggle__line sidebar-toggle__line--bottom" />
          </span>
        </button>
      )}

      {/* 
        ОСНОВНОЙ КОНТЕЙНЕР САЙДБАРА
        - position: fixed — всегда виден на десктопе
        - Анимация выезда на мобильных через transform
        - ARIA: aria-label для скринридеров
        - Модификаторы классов для состояний: --visible, --mobile, --desktop
      */}
      <nav 
        id="sidebar-nav"
        className={`sidebar ${isMobileMenuOpen ? 'sidebar--visible' : ''} ${isMobile ? 'sidebar--mobile' : 'sidebar--desktop'}`}
        aria-label="Основная навигация"
      >
        <div className="sidebar__container">
          
          {/* 
            НАВИГАЦИОННОЕ МЕНЮ
            - role="menubar" для семантики доступности
            - Генерация пунктов из массива NAV_ITEMS
            - NavLink автоматически добавляет класс 'active' при совпадении маршрута
            - Логотип удалён для минималистичного дизайна
          */}
          <ul className="sidebar__menu" role="menubar">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="sidebar__menu-item" role="none">
                <NavLink 
                  to={item.to}
                  className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                  end={item.end} // Точное совпадение пути (для главной страницы)
                  onClick={closeMobileMenu} // Закрываем меню после клика на мобильных
                  role="menuitem"
                >
                  {/* Иконка пункта меню, скрыта от скринридеров (декоративная) */}
                  <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
                  {/* Текст ссылки */}
                  <span className="sidebar__label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 
            FOOTER: Информация о пользователе и кнопка выхода
            - Прижата к низу через margin-top: auto в контейнере
            - Аватар генерируется из первой буквы email
            - Кнопка выхода с подтверждением через Redux
          */}
          <footer className="sidebar__footer">
            <div className="sidebar__user-info">
              {/* Аватар пользователя с accessibility-метками */}
              <div className="sidebar__avatar" aria-label={`Пользователь: ${user?.email || 'Гость'}`}>
                {userAvatar}
              </div>
              {/* Email пользователя с обрезкой через text-overflow */}
              <div className="sidebar__user-email" title={user?.email} aria-label={`Email: ${user?.email}`}>
                {user?.email}
              </div>
            </div>
            
            {/* 
              КНОПКА ВЫХОДА
              - Тип button для предотвращения сабмита форм
              - aria-label для скринридеров (иконка скрыта)
              - Обработчик handleLogout с обработкой ошибок
            */}
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

// displayName помогает в отладке через React DevTools
Sidebar.displayName = 'Sidebar';

export default Sidebar;
