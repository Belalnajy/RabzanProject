import React from 'react';
import { useTranslation } from 'react-i18next';

const Logo = ({ light = false, size = 160 }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Use the provided logo files based on the current language
  const logoSrc = isRTL
    ? '/final logo arabic svg-01-01.svg'
    : '/final logo english-01-01.svg';

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
