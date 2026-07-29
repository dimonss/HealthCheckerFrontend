import { useLanguage, type Language } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const LanguageSwitcher = ({ variant = 'compact', className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  return (
    <div className={`language-switcher ${variant} ${className}`}>
      <Globe size={16} className="lang-icon" />
      <div className="lang-buttons">
        <button
          type="button"
          className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
          onClick={() => handleSelect('ru')}
          aria-label="Переключить на русский"
        >
          РУ
        </button>
        <span className="lang-divider">/</span>
        <button
          type="button"
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => handleSelect('en')}
          aria-label="Switch to English"
        >
          EN
        </button>
      </div>
    </div>
  );
};
