import { useState, useEffect } from 'react';

export interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}

export const useApiSettings = () => {
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4',
    endpoint: ''
  });

  // Load API settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('apiSettings');
    if (savedSettings) {
      setApiSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveApiSettings = (provider: string, apiKey: string, model: string, endpoint?: string) => {
    const newSettings = { provider, apiKey, model, endpoint };
    setApiSettings(newSettings);
    localStorage.setItem('apiSettings', JSON.stringify(newSettings));
  };

  return {
    apiSettings,
    saveApiSettings
  };
}; 