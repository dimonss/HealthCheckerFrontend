# HealthChecker Frontend

Client-side application for the API endpoint health monitoring service (HealthChecker).

---

## 🚀 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with JWT interceptors and auto-refresh token flow)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with CSS Custom Properties, Dark Theme, and Glassmorphism design

## 🛠 Features

- **Authentication**:
  - Sign in via Google Sign-In SDK and Telegram Login Widget (integrated with ChalyshAuth).
  - JWT token management (`accessToken`, `refreshToken` stored in `localStorage`).
  - Protected routes (`ProtectedRoute`).

- **Dashboard**:
  - Overall summary statistics (total endpoints, online count, error count).
  - Real-time status list of monitored endpoints.
  - Add/Edit endpoint modal form (limited to 10 endpoints per user).
  - Instant manual health check button.

- **Endpoint Detail Page**:
  - Interactive response time graph (**Response Time AreaChart**).
  - Availability indicator (**Uptime %**).
  - Detailed health check history table including HTTP status codes and error messages.

## 📦 Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run dev server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

## ⚙️ Environment Variables (`.env`)

Create a `.env` file if you need to override default settings:

```env
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_TELEGRAM_BOT_NAME=your_telegram_bot_name
```

---
---

# HealthChecker Frontend (Русская версия)

Клиентская часть сервиса мониторинга доступности API эндпоинтов (HealthChecker).

---

## 🚀 Стек технологий

- **Фреймворк**: React 19
- **Сборщик**: Vite 8
- **Язык**: TypeScript
- **Маршрутизация**: React Router DOM v7
- **HTTP клиент**: Axios (с перехватчиками для JWT и автоматическим refresh-токеном)
- **Графики**: Recharts
- **Иконки**: Lucide React
- **Стили**: Vanilla CSS с использованием CSS Custom Properties, тёмная тема и Glassmorphism дизайн

## 🛠 Функциональность

- **Авторизация**:
  - Вход через Google Sign-In SDK и Telegram Login Widget (интеграция с ChalyshAuth).
  - Поддержка JWT-токенов (`accessToken`, `refreshToken` в `localStorage`).
  - Защищённые маршруты (`ProtectedRoute`).

- **Дашборд**:
  - Общая статистика (всего эндпоинтов, количество в сети, количество с ошибкой).
  - Список monitored-эндпоинтов с индикаторами статуса в реальном времени.
  - Форма добавления/редактирования эндпоинта (ограничение до 10 штук).
  - Кнопка ручной проверки эндпоинта по клику.

- **Детальная страница эндпоинта**:
  - Интерактивный график времени ответа (**Response Time AreaChart**).
  - Индикатор доступности (**Uptime %**).
  - Подробная история проверок с кодами ответов и сообщениями об ошибках.

## 📦 Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск в режиме разработки
```bash
npm run dev
```
Приложение будет доступно по адресу `http://localhost:5173`.

### 3. Сборка для production
```bash
npm run build
```

### 4. Предпросмотр production-сборки
```bash
npm run preview
```

## ⚙️ Переменные окружения (`.env`)

Создайте файл `.env` при необходимости переопределить настройки по умолчанию:

```env
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_TELEGRAM_BOT_NAME=your_telegram_bot_name
```
