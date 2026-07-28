import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { CreateEndpointData } from '../../api/endpoints';
import './EndpointForm.css';

interface Props {
  onSubmit: (data: CreateEndpointData) => Promise<void>;
  onCancel: () => void;
}

const INTERVAL_OPTIONS = [
  { value: '300', label: '5 мин' },
  { value: '900', label: '15 мин' },
  { value: '1800', label: '30 мин' },
  { value: '3600', label: '1 час' },
  { value: '21600', label: '6 часов' },
  { value: '43200', label: '12 часов' },
  { value: '86400', label: '24 часа' },
];

export const EndpointForm = ({ onSubmit, onCancel }: Props) => {
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

  return (
    <form onSubmit={handleSubmit} className="endpoint-form">
      <Input 
        label="Название" 
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        required 
      />
      <Input 
        label="URL" 
        type="url"
        value={url}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        required 
      />
      <div className="form-row">
        <Select 
          label="Метод"
          value={method}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value as 'GET' | 'POST' | 'HEAD')}
          options={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'HEAD', label: 'HEAD' }
          ]}
        />
        <Select 
          label="Интервал проверки"
          value={String(checkIntervalSeconds)}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCheckIntervalSeconds(Number(e.target.value))}
          options={INTERVAL_OPTIONS}
        />
      </div>
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
        <Button type="submit" isLoading={loading}>Сохранить</Button>
      </div>
    </form>
  );
};
