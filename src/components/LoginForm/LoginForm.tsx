// src/components/LoginForm/LoginForm.tsx
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginThunk, clearError } from '../../store/authSlice';
import { ILoginValues } from '../../types/auth.types';
import './LoginForm.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен')
    .matches(/@welthungerhilfe\.de$/, 'Используйте @welthungerhilfe.de'),
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
      {showSuccess && (
        <div className="apple-notification apple-notification--success">
          <div className="apple-notification__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="apple-notification__content">
            <p className="apple-notification__title">Вход выполнен</p>
            <p className="apple-notification__message">
              Добро пожаловать, {user?.email?.split('@')[0]}!
            </p>
          </div>
        </div>
      )}

      <div className="login-page__image-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Background" 
          className="login-page__image" 
        />
      </div>

      <div className="login-page__form-wrapper">
        <div className="login-form">
          <div className="login-form__header">
            <div className="login-form__logo-wrapper">
              <img 
                src="https://igadgetsmart.com/content/images/2/400x200l50nn0/95500910583574.webp" 
                alt="Logo" 
                className="login-form__logo" 
              />
              <div className="login-form__logo-badge"></div>
            </div>
            <p className="login-form__subtitle">Платформа для сотрудников</p>
            <h1 className="login-form__title">Войти</h1>
          </div>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, setFieldValue }) => (
              <Form className="login-form__body">
                <div className="login-form__field">
                  <div className="login-form__input-wrapper">
                    <Field
                      name="email"
                      type="email"
                      placeholder="someone@example.com"
                      className={`login-form__input ${
                        touched.email && errors.email ? 'login-form__input--error' : ''
                      }`}
                    />
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        field.value && (
                          <button
                            type="button"
                            className="login-form__clear-button"
                            onClick={() => setFieldValue('email', '')}
                            aria-label="Очистить поле"
                            tabIndex={-1}
                          >
                            ×
                          </button>
                        )
                      )}
                    </Field>
                  </div>
                  <ErrorMessage 
                    name="email" 
                    component="span" 
                    className="login-form__error-text" 
                  />
                </div>

                {error && (
                  <div className="login-form__global-error">{error}</div>
                )}

                <button 
                  type="submit" 
                  className="login-form__button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Загрузка...' : 'Далее'}
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