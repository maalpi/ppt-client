'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function DarkLightToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Espera até que o tema esteja montado para evitar problemas de renderização
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const currentTheme = theme === 'system' ? systemTheme : theme;
      // Se o tema for 'light', o switch será ativado (checked)
      setIsChecked(currentTheme === 'light');
    }
  }, [isMounted, theme, systemTheme]);

  const toggleTheme = () => {
    const newTheme = isChecked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!isMounted) return null; // Evita a renderização até que o tema esteja montado

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={() => {
        setIsChecked(!isChecked);
        toggleTheme();
      }}
    />
  );
}
