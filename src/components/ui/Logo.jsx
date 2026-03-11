'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const Logo = ({ light = false, size = 160 }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use the provided logo files based on the current language
  const logoSrc = isRTL
    ? '/final logo arabic svg-01-01.svg'
    : '/final logo english-01-01.svg';

  if (!mounted) {
    return (
      <div
        className="flex items-center"
        style={{ height: size, width: size * 2 }}>
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <img
        src={logoSrc}
        alt="Rabzan Logo"
        style={{
          height: size ? size : 'auto',
          width: 'auto',
        }}
        className="transition-all duration-300"
      />
    </div>
  );
};

export default Logo;
