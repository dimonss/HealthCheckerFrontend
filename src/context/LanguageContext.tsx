import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    // Auth & Login
    loginTitle: 'HealthChecker',
    loginSubtitle: 'Войдите для доступа к панели мониторинга',
    googleError: 'Ошибка входа через Google',
    telegramError: 'Ошибка входа через Telegram',
    or: 'или',

    // Layout
    dashboard: 'Дашборд',
    userDefault: 'Пользователь',
    logout: 'Выйти',
    monitoring: 'Мониторинг',

    // Dashboard Page
    totalEndpoints: 'Всего эндпоинтов',
    online: 'В сети',
    withError: 'С ошибкой',
    yourEndpoints: 'Ваши эндпоинты',
    add: 'Добавить',
    limitReached: 'Лимит 10 эндпоинтов достигнут',
    newEndpoint: 'Новый эндпоинт',
    endpointDeleted: 'Эндпоинт "{name}" удален',
    deleteError: 'Ошибка при удалении эндпоинта',

    // Endpoint List & Card
    noEndpoints: 'Нет добавленных эндпоинтов',
    check: 'Проверить',
    every: 'Каждые {interval}',
    unitMin: '{count} мин',
    unitHour: '{count} ч',

    // Endpoint Form
    nameLabel: 'Название',
    urlLabel: 'URL',
    methodLabel: 'Метод',
    intervalLabel: 'Интервал проверки',
    cancel: 'Отмена',
    save: 'Сохранить',
    interval5min: '5 мин',
    interval15min: '15 мин',
    interval30min: '30 мин',
    interval1hour: '1 час',
    interval6hours: '6 часов',
    interval12hours: '12 часов',
    interval24hours: '24 часа',

    // Status Badge
    statusOnline: 'Работает',
    statusDown: 'Ошибка',
    statusUnknown: 'Неизвестно',

    // Detail Page
    back: 'Назад',
    endpointNotFound: 'Эндпоинт не найден',
    avgResponseTime: 'Среднее время',
    minMaxResponseTime: 'Мин / Макс',
    checksForPeriod: 'Проверок за период',
    ms: 'мс',
    checkHistory: 'История проверок',
    noHistoryData: 'Нет данных. Нажмите "Проверить" для первой проверки.',
    colStatus: 'Статус',
    colResponseTime: 'Время ответа',
    colResponseCode: 'Код ответа',
    colDateTime: 'Дата и время',
    colError: 'Ошибка',

    // Charts
    responseTimeTitle: 'Время ответа (мс)',
    responseTimeTooltip: 'Время ответа',
    overallUptime: 'Общий Uptime',
    period1h: '1 час',
    period24h: '24 часа',
    period7d: '7 дней',
    period30d: '30 дней',

    // Pagination
    showingCount: 'Показано {start}–{end} из {total}',
    showPerPage: 'Показывать по:',
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',

    // Toast
    undo: 'Отменить',
    close: 'Закрыть',
    secUnit: 'с',

    // Theme
    themeDark: 'Тёмная',
    themeLight: 'Светлая',
    themeSystem: 'Устройство',

    // Telegram Integration Modal
    telegramSettings: 'Telegram Бот',
    telegramConnected: 'Telegram привязан (ID: {id})',
    telegramNotConnected: 'Telegram не привязан',
    telegramConnectDesc: 'Подключите Telegram бота для получения мгновенных уведомлений в ЛС и Telegram-группы при не-200 статусе сервисов.',
    generateCode: 'Сгенерировать код привязки',
    codeValidTime: 'Код действителен 15 минут:',
    sendCodeInstruction: 'Отправьте боту команду в ЛС или в группу:',
    openInTelegram: 'Открыть бота в Telegram',
    copyCode: 'Копировать код',
    codeCopied: 'Код скопирован!',
    unlinkTelegramBtn: 'Отвязать Telegram',
    linkedChatsTitle: 'Подключенные группы и чаты ({count})',
    noLinkedChats: 'Нет подключенных чатов',
    unsubscribeChat: 'Отключить',
  },
  en: {
    // Auth & Login
    loginTitle: 'HealthChecker',
    loginSubtitle: 'Log in to access the monitoring dashboard',
    googleError: 'Google sign-in error',
    telegramError: 'Telegram sign-in error',
    or: 'or',

    // Layout
    dashboard: 'Dashboard',
    userDefault: 'User',
    logout: 'Log out',
    monitoring: 'Monitoring',

    // Dashboard Page
    totalEndpoints: 'Total Endpoints',
    online: 'Online',
    withError: 'With Error',
    yourEndpoints: 'Your Endpoints',
    add: 'Add',
    limitReached: 'Limit of 10 endpoints reached',
    newEndpoint: 'New Endpoint',
    endpointDeleted: 'Endpoint "{name}" deleted',
    deleteError: 'Error deleting endpoint',

    // Endpoint List & Card
    noEndpoints: 'No endpoints added',
    check: 'Check',
    every: 'Every {interval}',
    unitMin: '{count} min',
    unitHour: '{count} h',

    // Endpoint Form
    nameLabel: 'Name',
    urlLabel: 'URL',
    methodLabel: 'Method',
    intervalLabel: 'Check Interval',
    cancel: 'Cancel',
    save: 'Save',
    interval5min: '5 min',
    interval15min: '15 min',
    interval30min: '30 min',
    interval1hour: '1 hour',
    interval6hours: '6 hours',
    interval12hours: '12 hours',
    interval24hours: '24 hours',

    // Status Badge
    statusOnline: 'Online',
    statusDown: 'Down',
    statusUnknown: 'Unknown',

    // Detail Page
    back: 'Back',
    endpointNotFound: 'Endpoint not found',
    avgResponseTime: 'Avg Response Time',
    minMaxResponseTime: 'Min / Max',
    checksForPeriod: 'Checks for Period',
    ms: 'ms',
    checkHistory: 'Check History',
    noHistoryData: 'No data. Click "Check" to perform the first check.',
    colStatus: 'Status',
    colResponseTime: 'Response Time',
    colResponseCode: 'Response Code',
    colDateTime: 'Date & Time',
    colError: 'Error',

    // Charts
    responseTimeTitle: 'Response Time (ms)',
    responseTimeTooltip: 'Response Time',
    overallUptime: 'Overall Uptime',
    period1h: '1 hour',
    period24h: '24 hours',
    period7d: '7 days',
    period30d: '30 days',

    // Pagination
    showingCount: 'Showing {start}–{end} of {total}',
    showPerPage: 'Show per page:',
    prevPage: 'Previous page',
    nextPage: 'Next page',

    // Toast
    undo: 'Undo',
    close: 'Close',
    secUnit: 's',

    // Theme
    themeDark: 'Dark',
    themeLight: 'Light',
    themeSystem: 'System',

    // Telegram Integration Modal
    telegramSettings: 'Telegram Bot',
    telegramConnected: 'Telegram linked (ID: {id})',
    telegramNotConnected: 'Telegram not linked',
    telegramConnectDesc: 'Connect Telegram bot to get instant notifications in DM and Telegram groups when services return non-200 status.',
    generateCode: 'Generate Link Code',
    codeValidTime: 'Code valid for 15 minutes:',
    sendCodeInstruction: 'Send command to bot in DM or group:',
    openInTelegram: 'Open Bot in Telegram',
    copyCode: 'Copy Code',
    codeCopied: 'Code copied!',
    unlinkTelegramBtn: 'Unlink Telegram',
    linkedChatsTitle: 'Connected Groups & Chats ({count})',
    noLinkedChats: 'No connected chats',
    unsubscribeChat: 'Disconnect',
  }


};

export type TranslationKey = keyof typeof translations.ru;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const getInitialLanguage = (): Language => {
  const savedLang = localStorage.getItem('language');
  if (savedLang === 'ru' || savedLang === 'en') {
    return savedLang;
  }
  
  const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
  if (navLang.startsWith('ru')) {
    return 'ru';
  }
  return 'en';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.ru;
    let template = langDict[key] || translations.ru[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }

    return template;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
