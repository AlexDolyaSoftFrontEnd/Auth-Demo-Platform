import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { FiX, FiBell, FiLock, FiUser, FiGlobe, FiMoon } from 'react-icons/fi';
import './Settings.css';

// ============================================
// ТИПЫ
// ============================================

interface SettingsField {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

interface SettingsToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon?: React.ReactNode;
}

interface SettingsCheckbox {
  id: string;
  label: string;
  checked: boolean;
}

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================

const Settings: React.FC = () => {
  // Поля профиля
  const [profileFields, setProfileFields] = useState<SettingsField[]>([
    { id: 'username', label: 'Имя пользователя', value: 'john_doe', placeholder: 'Введите имя' },
    { id: 'email', label: 'Email', value: 'john@example.com', type: 'email', placeholder: 'Введите email' },
    { id: 'phone', label: 'Телефон', value: '+380 50 123 4567', placeholder: 'Введите телефон' },
  ]);

  // Поля безопасности
  const [securityFields, setSecurityFields] = useState<SettingsField[]>([
    { id: 'current-password', label: 'Текущий пароль', value: '', type: 'password', placeholder: 'Введите текущий пароль' },
    { id: 'new-password', label: 'Новый пароль', value: '', type: 'password', placeholder: 'Введите новый пароль' },
    { id: 'confirm-password', label: 'Подтверждение пароля', value: '', type: 'password', placeholder: 'Подтвердите новый пароль' },
  ]);

  // Переключатели
  const [toggles, setToggles] = useState<SettingsToggle[]>([
    { id: 'notifications', label: 'Уведомления', description: 'Получать уведомления о новых событиях', enabled: true, icon: <FiBell /> },
    { id: 'two-factor', label: 'Двухфакторная аутентификация', description: 'Дополнительная защита аккаунта', enabled: false, icon: <FiLock /> },
    { id: 'dark-mode', label: 'Тёмная тема', description: 'Использовать тёмную тему оформления', enabled: false, icon: <FiMoon /> },
  ]);

  // Чекбоксы
  const [checkboxes, setCheckboxes] = useState<SettingsCheckbox[]>([
    { id: 'marketing', label: 'Получать маркетинговые рассылки', checked: false },
    { id: 'newsletter', label: 'Подписаться на еженедельную рассылку', checked: true },
    { id: 'updates', label: 'Получать обновления о продукте', checked: true },
  ]);

  // ============================================
  // ОБРАБОТЧИКИ
  // ============================================

  // Очистка поля
  const handleClearField = (section: 'profile' | 'security', id: string) => {
    if (section === 'profile') {
      setProfileFields(prev =>
        prev.map(field => field.id === id ? { ...field, value: '' } : field)
      );
    } else {
      setSecurityFields(prev =>
        prev.map(field => field.id === id ? { ...field, value: '' } : field)
      );
    }
  };

  // Изменение поля
  const handleFieldChange = (section: 'profile' | 'security', id: string, value: string) => {
    if (section === 'profile') {
      setProfileFields(prev =>
        prev.map(field => field.id === id ? { ...field, value } : field)
      );
    } else {
      setSecurityFields(prev =>
        prev.map(field => field.id === id ? { ...field, value } : field)
      );
    }
  };

  // Переключение тоггла
  const handleToggleChange = (id: string) => {
    setToggles(prev =>
      prev.map(toggle => toggle.id === id ? { ...toggle, enabled: !toggle.enabled } : toggle)
    );
  };

  // Переключение чекбокса
  const handleCheckboxChange = (id: string) => {
    setCheckboxes(prev =>
      prev.map(checkbox => checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox)
    );
  };

  // ============================================
  // РЕНДЕР
  // ============================================

  return (
    <div className="page-wrapper">
      <Sidebar />
      
      <main className="page-content">
        <div className="settings-container">
          {/* Заголовок страницы */}
          <header className="settings-header">
            <h1 className="settings-title">⚙️ Настройки</h1>
            <p className="settings-subtitle">Настройки профиля</p>
          </header>

          {/* Секция: Профиль */}
          <section className="settings-section">
            <div className="settings-section__header">
              <FiUser className="settings-section__icon" />
              <h2 className="settings-section__title">Профиль</h2>
            </div>
            
            <div className="settings-form">
              {profileFields.map((field) => (
                <div key={field.id} className="form-group">
                  <label htmlFor={field.id} className="form-label">{field.label}</label>
                  <div className="form-input-wrapper">
                    <input
                      id={field.id}
                      type={field.type || 'text'}
                      value={field.value}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange('profile', field.id, e.target.value)}
                      className="form-input"
                      autoComplete="off"
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => handleClearField('profile', field.id)}
                        className="form-clear-btn"
                        aria-label={`Очистить поле ${field.label}`}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Секция: Безопасность */}
          <section className="settings-section">
            <div className="settings-section__header">
              <FiLock className="settings-section__icon" />
              <h2 className="settings-section__title">Безопасность</h2>
            </div>
            
            <div className="settings-form">
              {securityFields.map((field) => (
                <div key={field.id} className="form-group">
                  <label htmlFor={field.id} className="form-label">{field.label}</label>
                  <div className="form-input-wrapper">
                    <input
                      id={field.id}
                      type={field.type || 'text'}
                      value={field.value}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange('security', field.id, e.target.value)}
                      className="form-input"
                      autoComplete="off"
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => handleClearField('security', field.id)}
                        className="form-clear-btn"
                        aria-label={`Очистить поле ${field.label}`}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Секция: Переключатели */}
          <section className="settings-section">
            <div className="settings-section__header">
              <FiGlobe className="settings-section__icon" />
              <h2 className="settings-section__title">Предпочтения</h2>
            </div>
            
            <div className="settings-toggles">
              {toggles.map((toggle) => (
                <div key={toggle.id} className="toggle-item">
                  <div className="toggle-item__content">
                    {toggle.icon && <div className="toggle-item__icon">{toggle.icon}</div>}
                    <div className="toggle-item__text">
                      <span className="toggle-item__label">{toggle.label}</span>
                      <span className="toggle-item__description">{toggle.description}</span>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={toggle.enabled}
                      onChange={() => handleToggleChange(toggle.id)}
                      className="toggle-switch__input"
                    />
                    <span className="toggle-switch__slider" aria-hidden="true" />
                    <span className="toggle-switch__label">
                      {toggle.enabled ? 'Вкл' : 'Выкл'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Секция: Чекбоксы */}
          <section className="settings-section">
            <div className="settings-section__header">
              <FiBell className="settings-section__icon" />
              <h2 className="settings-section__title">Рассылки</h2>
            </div>
            
            <div className="settings-checkboxes">
              {checkboxes.map((checkbox) => (
                <label key={checkbox.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={checkbox.checked}
                    onChange={() => handleCheckboxChange(checkbox.id)}
                    className="checkbox-item__input"
                  />
                  <span className="checkbox-item__checkmark" aria-hidden="true" />
                  <span className="checkbox-item__label">{checkbox.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Кнопки действий */}
          <div className="settings-actions">
            <button type="button" className="btn btn--secondary">
              Отмена
            </button>
            <button type="button" className="btn btn--primary">
              Сохранить изменения
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
