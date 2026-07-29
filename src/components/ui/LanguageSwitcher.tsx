import { useLanguage, type Language } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  const options: { lang: Language; label: string; ariaLabel: string }[] = [
    { lang: 'ru', label: 'RU', ariaLabel: 'Переключить на русский' },
    { lang: 'en', label: 'EN', ariaLabel: 'Switch to English' },
  ];

  return (
    <div className={`language-switcher ${className}`} role="radiogroup" aria-label="Language switcher">
      <div className="lang-switcher-options">
        {options.map(({ lang, label, ariaLabel }) => {
          const isActive = language === lang;
          return (
            <button
              key={lang}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={ariaLabel}
              className={`lang-option ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(lang)}
            >
              <span className="lang-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
