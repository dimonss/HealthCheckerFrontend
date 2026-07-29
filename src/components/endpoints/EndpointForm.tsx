import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';
import type { CreateEndpointData } from '../../api/endpoints';
import './EndpointForm.css';

interface Props {
  onSubmit: (data: CreateEndpointData) => Promise<void>;
  onCancel: () => void;
}

const INTERVAL_CONFIG: { value: string; labelKey: TranslationKey }[] = [
  { value: '300', labelKey: 'interval5min' },
  { value: '900', labelKey: 'interval15min' },
  { value: '1800', labelKey: 'interval30min' },
  { value: '3600', labelKey: 'interval1hour' },
  { value: '21600', labelKey: 'interval6hours' },
  { value: '43200', labelKey: 'interval12hours' },
  { value: '86400', labelKey: 'interval24hours' },
];

export const EndpointForm = ({ onSubmit, onCancel }: Props) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [method, setMethod] = useState<'GET' | 'POST' | 'HEAD'>('GET');
  const [checkIntervalSeconds, setCheckIntervalSeconds] = useState(300);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, url, method, checkIntervalSeconds });
    } finally {
      setLoading(false);
    }
  };

  const intervalOptions = INTERVAL_CONFIG.map(item => ({
    value: item.value,
    label: t(item.labelKey),
  }));

  return (
    <form onSubmit={handleSubmit} className="endpoint-form">
      <Input 
        label={t('nameLabel')} 
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        required 
      />
      <Input 
        label={t('urlLabel')} 
        type="url"
        value={url}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        required 
      />
      <div className="form-row">
        <Select 
          label={t('methodLabel')}
          value={method}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value as 'GET' | 'POST' | 'HEAD')}
          options={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'HEAD', label: 'HEAD' }
          ]}
        />
        <Select 
          label={t('intervalLabel')}
          value={String(checkIntervalSeconds)}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCheckIntervalSeconds(Number(e.target.value))}
          options={intervalOptions}
        />
      </div>
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>{t('cancel')}</Button>
        <Button type="submit" isLoading={loading}>{t('save')}</Button>
      </div>
    </form>
  );
};

