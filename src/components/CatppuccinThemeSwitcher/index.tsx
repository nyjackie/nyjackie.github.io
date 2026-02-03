import React, { useEffect, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const themes = [
  { name: 'Latte', value: 'latte' },
  { name: 'Frappé', value: 'frappe' },
  { name: 'Macchiato', value: 'macchiato' },
  { name: 'Mocha', value: 'mocha' }
];

export default function CatppuccinThemeSwitcher(): JSX.Element {
  const { setColorMode } = useColorMode();
  const [currentTheme, setCurrentTheme] = useState('mocha');

  useEffect(() => {
    const saved = localStorage.getItem('catppuccin-theme') || 'mocha';
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-catppuccin-theme', saved);
    setColorMode(saved === 'latte' ? 'light' : 'dark');
  }, [setColorMode]);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('catppuccin-theme', theme);
    document.documentElement.setAttribute('data-catppuccin-theme', theme);
    setColorMode(theme === 'latte' ? 'light' : 'dark');
  };

  return (
    <select
      value={currentTheme}
      onChange={(e) => handleThemeChange(e.target.value)}
      style={{
        padding: '4px 8px',
        border: '1px solid var(--ifm-toc-border-color)',
        borderRadius: '4px',
        background: 'var(--ifm-background-surface-color)',
        color: 'var(--ifm-font-color-base)',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      {themes.map(({ name, value }) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
  );
}