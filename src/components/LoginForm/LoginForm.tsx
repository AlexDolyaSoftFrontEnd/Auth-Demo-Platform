// src/components/LoginForm/LoginForm.tsx
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginThunk, clearError } from '../../store/authSlice';
import { ILoginValues } from '../../types/auth.types';
import { FiMail, FiX, FiCheck, FiLogIn } from 'react-icons/fi';
import './LoginForm.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен')
    .matches(/@welthungerhilfe\.de$/, 'Используйте корпоративный email @welthungerhilfe.de'),
});

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [showSuccess, setShowSuccess] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate('/home', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: ILoginValues) => {
    dispatch(clearError());
    await dispatch(loginThunk(values));
  };

  return (
    <div className="login-page">
      {/* Уведомление об успешном входе */}
      {showSuccess && (
        <div className="apple-notification apple-notification--success">
          <div className="apple-notification__icon">
            <FiCheck />
          </div>
          <div className="apple-notification__content">
            <p className="apple-notification__title">Вход выполнен</p>
            <p className="apple-notification__message">
              Добро пожаловать, {user?.email?.split('@')[0]}!
            </p>
          </div>
        </div>
      )}

      {/* Фоновое изображение */}
      <div className="login-page__background">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Background" 
          className="login-page__background-image" 
        />
      </div>

      {/* Форма входа */}
      <div className="login-page__form-container">
        <div className="login-form">
          {/* Логотип */}
          <div className="login-form__header">
            <img 
              src="https://cdn.dribbble.com/userupload/44970967/file/bb19b75c7489d8dadb8b1b709bb8ee65.png?resize=400x0" 
              alt="WHH Logo" 
              className="login-form__logo" 
            />
            <p className="login-form__subtitle">Платформа для сотрудников</p>
          </div>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, setFieldValue, values }) => (
              <Form className="login-form__body">
                <div className="login-form__field">
                  <label htmlFor="email" className="login-form__label">
                    Корпоративный email:
                  </label>
                  <div className="login-form__input-group">
                    <FiMail className="login-form__input-icon" />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@welthungerhilfe.de"
                      autoComplete="email"
                      className={`login-form__input ${
                        touched.email && errors.email ? 'login-form__input--error' : ''
                      } ${values.email ? 'login-form__input--filled' : ''}`}
                    />
                    {values.email && (
                      <button
                        type="button"
                        className="login-form__clear-btn"
                        onClick={() => setFieldValue('email', '')}
                        aria-label="Очистить поле"
                        tabIndex={-1}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                  <ErrorMessage 
                    name="email" 
                    component="span" 
                    className="login-form__error" 
                  />
                </div>

                {error && (
                  <div className="login-form__alert login-form__alert--error">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="login-form__submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="login-form__btn-loading">
                      <span className="login-form__spinner"></span>
                      Проверка...
                    </span>
                  ) : (
                    <>
                      <span>Продолжить</span>
                      <FiLogIn className="login-form__btn-icon" />
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;