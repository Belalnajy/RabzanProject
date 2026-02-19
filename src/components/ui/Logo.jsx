import React from 'react';

const Logo = ({ light = false, size = 60, isArabic = true }) => {
  const color = light ? '#ffffff' : '#002B5B';
  const accent = '#2D5A27';

  return (
    <div className="flex items-center gap-4 flex-row">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="shrink-0 transition-transform duration-500 hover:rotate-[360deg]">
        <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="4" />
        <path
          d="M35 30H55C65 30 70 35 70 45C70 55 65 60 55 60H45V80"
          stroke={accent}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="45" y1="50" x2="68" y2="50" stroke={color} strokeWidth="4" />
        <path
          d="M75 75L85 85"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col text-right">
        <span
          className="font-black leading-none font-cairo"
          style={{
            fontSize: size / 2,
            color: color,
          }}>
          رَبـزَان
        </span>
        <span
          className="font-bold font-cairo"
          style={{
            fontSize: size / 4.5,
            color: accent,
          }}>
          للتجارة الدولية
        </span>
      </div>
    </div>
  );
};

export default Logo;
