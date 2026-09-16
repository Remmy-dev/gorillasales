'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ConfigStore, DEFAULT_CONFIG, loadConfig, saveConfig } from '@/lib/configStore';

interface ConfigContextValue {
  config: ConfigStore;
  updateConfig: (next: ConfigStore) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // Initialize with DEFAULT_CONFIG to match SSR output, then hydrate from localStorage
  const [config, setConfig] = useState<ConfigStore>(DEFAULT_CONFIG);

  useEffect(() => {
    // Load from localStorage after hydration to avoid SSR/client mismatch
    setConfig(loadConfig());
  }, []);

  const updateConfig = useCallback((next: ConfigStore) => {
    setConfig(next);
    saveConfig(next);
  }, []);

  // Sync from storage on focus (other tabs)
  useEffect(() => {
    const onFocus = () => setConfig(loadConfig());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used inside ConfigProvider');
  return ctx;
}
