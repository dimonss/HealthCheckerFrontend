import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import './ThemeSwitcher.css';

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeSwitcher = ({ className = '', showLabels = false }: ThemeSwitcherProps) => {
  const { themeMode, setThemeMode } = useTheme();
  const { t } = useLanguage();

  const options: { mode: ThemeMode; labelKey: 'themeDark' | 'themeLight' | 'themeSystem'; Icon: typeof Sun }[] = [
    { mode: 'dark', labelKey: 'themeDark', Icon: Moon },
    { mode: 'light', labelKey: 'themeLight', Icon: Sun },
    { mode: 'system', labelKey: 'themeSystem', Icon: Monitor },
  ];

  return (
    <div className={`theme-switcher ${className}`} role="radiogroup" aria-label="Theme switcher">
      <div className="theme-switcher-options">
        {options.map(({ mode, labelKey, Icon }) => {
          const isActive = themeMode === mode;
          const label = t(labelKey);
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={label}
              title={label}
              className={`theme-option ${isActive ? 'active' : ''}`}
              onClick={() => setThemeMode(mode)}
            >
              <Icon size={15} className="theme-icon" />
              {showLabels && <span className="theme-label">{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
