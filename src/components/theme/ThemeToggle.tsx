// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {SunIcon, MoonIcon} from "lucide-react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg">
        <SunIcon/>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <MoonIcon/>  :<SunIcon/>}
    </button>
  );
}