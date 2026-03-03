# Форма авторизации

Форма входа на React с использованием TypeScript, Redux Toolkit, Formik и Yup с валидацией по домену электронной почты.

## Содержание

- [Описание проекта](#описание-проекта)
- [Технологии](#технологии)
- [Установка](#установка)
- [Структура проекта](#структура-проекта)
- [Описание файлов](#описание-файлов)
- [Использование](#использование)
- [Особенности](#особенности)

## Описание проекта

Проект представляет собой форму авторизации для организации Welthungerhilfe с:
- Валидацией email по домену `@welthungerhilfe.de`
- Интеграцией с Redux Toolkit для управления состоянием
- Типизацией TypeScript
- Стилизацией по методологии BEM
- Адаптивным дизайном

## Технологии

- **React 18+** - UI библиотека
- **TypeScript** - типизация JavaScript
- **Redux Toolkit** - управление состоянием
- **Formik** - управление формами
- **Yup** - валидация схем
- **CSS3** - стилизация с BEM
- **React Redux** - интеграция Redux с React

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Запустите проект:
```bash
npm start
# или
yarn start
```

## Структура проекта

```
src/
├── components/
│   └── LoginForm/
│       ├── LoginForm.tsx       # Основной компонент формы
│       └── LoginForm.css       # Стили компонента (BEM)
├── store/
│   ├── authSlice.ts            # Redux slice для авторизации
│   ├── hooks.ts                # Типизированные хуки Redux
│   └── index.ts                # Конфигурация store
├── types/
│   └── auth.types.ts           # TypeScript интерфейсы и типы
├── App.tsx                     # Корневой компонент
├── main.tsx                    # Точка входа приложения
└── index.css                   # Глобальные стили
```

## Описание файлов

### **`src/types/auth.types.ts`**
Определяет TypeScript интерфейсы для приложения:
- `ILoginValues` - значения формы входа
- `IUser` - интерфейс пользователя
- `IAuthState` - состояние аутентификации в Redux

**Пример:**
```typescript
export interface ILoginValues {
  email: string;
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

---

### **`src/store/authSlice.ts`**
Redux Toolkit slice для управления состоянием авторизации:
- `loginThunk` - асинхронный thunk для входа
- `logout` - экшен для выхода
- `clearError` - очистка ошибок

**Функционал:**
- Обработка загрузки (pending)
- Успешный вход (fulfilled)
- Обработка ошибок (rejected)

---

### **`src/store/hooks.ts`**
Типизированные хуки Redux для использования в компонентах:
- `useAppDispatch` - типизированный dispatch
- `useAppSelector` - типизированный selector

**Использование:**
```typescript
const dispatch = useAppDispatch();
const { isLoading } = useAppSelector((state) => state.auth);
```

---

### **`src/store/index.ts`**
Конфигурация Redux store:
- Подключение reducer'ов
- Экспорт типов `RootState` и `AppDispatch`

---

### **`src/components/LoginForm/LoginForm.tsx`**
Основной компонент формы авторизации:

**Функционал:**
- Интеграция Formik для управления формой
- Валидация Yup с проверкой домена
- Отправка данных через Redux thunk
- Отображение ошибок валидации и сервера
- Состояние загрузки

**Схема валидации:**
```typescript
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен')
    .matches(/@welthungerhilfe\.de$/, 'Используйте @welthungerhilfe.de'),
});
```

---

### **`src/components/LoginForm/LoginForm.css`**
Стили компонента по методологии **BEM** (Block Element Modifier):

**Структура именования:**
- `.login-page` - блок страницы
- `.login-page__image-wrapper` - элемент обертки изображения
- `.login-form__input--error` - модификатор поля с ошибкой

**Особенности:**
- Адаптивный дизайн (mobile-first)
- CSS transitions для плавных анимаций
- Состояния focus, hover, disabled
- Медиа-запросы для мобильных устройств

---

### **`src/App.tsx`**
Корневой компонент приложения:
- Обертка Provider для Redux
- Рендеринг LoginForm

---

### **`src/main.tsx`**
Точка входа приложения:
- Инициализация React 18 с createRoot
- Рендеринг App компонента
- StrictMode для разработки

## Использование

### Ввод валидного email:
```
user@welthungerhilfe.de  
```

### Ввод невалидного email:
```
user@example.com         (неверный домен)
invalid-email            (неверный формат)
```

### Состояния формы:

1. **Начальное состояние** - поле пустое или с placeholder
2. **Валидация** - проверка при вводе или отправке
3. **Загрузка** - кнопка disabled с текстом "Загрузка..."
4. **Успех** - данные сохранены в Redux store
5. **Ошибка** - отображение сообщения об ошибке

## Особенности

### Валидация
- Проверка формата email
- Обязательное поле
- Строгая проверка домена `@welthungerhilfe.de`

### UI/UX
- Чистый современный дизайн
- Визуальная обратная связь
- Адаптивность для мобильных устройств
- Плавные анимации переходов

### Архитектура
- Разделение логики и представления
- Типизация TypeScript
- Модульная структура
- Переиспользуемые компоненты

### State Management
- Redux Toolkit для глобального состояния
- Formik для локального состояния формы
- Асинхронные операции через createAsyncThunk

## Поддерживаемые браузеры

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)
```
