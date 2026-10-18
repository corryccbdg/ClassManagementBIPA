import React from 'react';

/**
 * High-definition SVG flags for international students in Lentera BIPA.
 * Solves the Windows OS issue where country flag emojis render as 2-letter text codes (e.g. DE, JP).
 */

const EMOJI_TO_CODE = {
  '🇩🇪': 'de',
  '🇯🇵': 'jp',
  '🇦🇺': 'au',
  '🇱🇦': 'la',
  '🇰🇷': 'kr',
  '🇮🇩': 'id',
  '🇺🇸': 'us',
  '🇫🇷': 'fr',
  '🇨🇳': 'cn',
  '🇷🇺': 'ru',
  '🇹🇭': 'th',
  '🇪🇸': 'es',
  '🇦🇪': 'ae',
  '🇳🇬': 'ng',
};

const NAME_TO_CODE = {
  'jerman': 'de',
  'germany': 'de',
  'jepang': 'jp',
  'japan': 'jp',
  'australia': 'au',
  'laos': 'la',
  'korea': 'kr',
  'korea selatan': 'kr',
  'south korea': 'kr',
  'indonesia': 'id',
  'amerika': 'us',
  'amerika serikat': 'us',
  'united states': 'us',
  'usa': 'us',
  'prancis': 'fr',
  'france': 'fr',
  'tiongkok': 'cn',
  'china': 'cn',
  'rusia': 'ru',
  'russia': 'ru',
  'thailand': 'th',
  'spanyol': 'es',
  'spain': 'es',
  'uni emirat arab': 'ae',
  'uae': 'ae',
  'nigeria': 'ng',
};

export function CountryFlag({ code, country, flag, className = "w-5 h-3.5", title }) {
  // Determine normalized code (lowercase 2-letter ISO)
  let iso = (code || '').toLowerCase();
  
  if (!iso && flag && EMOJI_TO_CODE[flag]) {
    iso = EMOJI_TO_CODE[flag];
  }
  
  if (!iso && country) {
    const cleanName = country.toLowerCase().trim();
    iso = NAME_TO_CODE[cleanName] || '';
  }

  const label = title || country || iso.toUpperCase();

  // SVG Flag renderers
  const renderFlag = () => {
    switch (iso) {
      case 'de': // Germany: Black, Red, Gold horizontal stripes
        return (
          <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
            <rect width="5" height="1" y="0" fill="#000000" />
            <rect width="5" height="1" y="1" fill="#DD0000" />
            <rect width="5" height="1" y="2" fill="#FFCE00" />
          </svg>
        );

      case 'jp': // Japan: White with red circle
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover bg-white">
            <rect width="3" height="2" fill="#FFFFFF" />
            <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
          </svg>
        );

      case 'au': // Australia: Blue with Union Jack canton and Commonwealth/Southern Cross stars
        return (
          <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
            <rect width="60" height="30" fill="#00247D" />
            {/* Canton: Union Jack */}
            <g>
              <clipPath id="au-canton">
                <rect width="30" height="15" />
              </clipPath>
              <g clipPath="url(#au-canton)">
                <rect width="30" height="15" fill="#00247D" />
                {/* Diagonals White */}
                <path d="M0 0 L30 15 M30 0 L0 15" stroke="#FFFFFF" strokeWidth="3" />
                {/* Diagonals Red */}
                <path d="M0 0 L15 7.5 M30 15 L15 7.5" stroke="#CF142B" strokeWidth="1" />
                <path d="M30 0 L15 7.5 M0 15 L15 7.5" stroke="#CF142B" strokeWidth="1" />
                {/* St George Cross White */}
                <path d="M15 0 v15 M0 7.5 h30" stroke="#FFFFFF" strokeWidth="5" />
                {/* St George Cross Red */}
                <path d="M15 0 v15 M0 7.5 h30" stroke="#CF142B" strokeWidth="3" />
              </g>
            </g>
            {/* Commonwealth Star (large 7-pointed) */}
            <circle cx="15" cy="22.5" r="3.2" fill="#FFFFFF" />
            {/* Southern Cross constellation */}
            <circle cx="45" cy="24" r="1.5" fill="#FFFFFF" />
            <circle cx="39" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="45" cy="6" r="1.5" fill="#FFFFFF" />
            <circle cx="51" cy="13" r="1.5" fill="#FFFFFF" />
            <circle cx="47.5" cy="18" r="1" fill="#FFFFFF" />
          </svg>
        );

      case 'la': // Laos: Red, Blue, Red with white circle
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="2" fill="#CE1126" />
            <rect width="3" height="1" y="0.5" fill="#002868" />
            <circle cx="1.5" cy="1" r="0.4" fill="#FFFFFF" />
          </svg>
        );

      case 'kr': // South Korea: White background with Taegeuk & 4 trigrams
        return (
          <svg viewBox="0 0 30 20" className="w-full h-full object-cover bg-white">
            <rect width="30" height="20" fill="#FFFFFF" />
            {/* Taegeuk Symbol */}
            <g transform="translate(15, 10) rotate(-34)">
              <circle cx="0" cy="0" r="5" fill="#0047A0" />
              <path d="M-5 0 A 5 5 0 0 1 5 0 A 2.5 2.5 0 0 1 0 0 A 2.5 2.5 0 0 0 -5 0 Z" fill="#CD2E3A" />
              <circle cx="2.5" cy="0" r="2.5" fill="#CD2E3A" />
            </g>
            {/* Trigram Top-Left (Geon) */}
            <g transform="translate(6, 4) rotate(34)" stroke="#000000" strokeWidth="0.7">
              <line x1="-2.5" y1="-1.6" x2="2.5" y2="-1.6" />
              <line x1="-2.5" y1="0" x2="2.5" y2="0" />
              <line x1="-2.5" y1="1.6" x2="2.5" y2="1.6" />
            </g>
            {/* Trigram Top-Right (Gam) */}
            <g transform="translate(24, 4) rotate(-34)" stroke="#000000" strokeWidth="0.7">
              <line x1="-2.5" y1="-1.6" x2="-0.5" y2="-1.6" />
              <line x1="0.5" y1="-1.6" x2="2.5" y2="-1.6" />
              <line x1="-2.5" y1="0" x2="2.5" y2="0" />
              <line x1="-2.5" y1="1.6" x2="-0.5" y2="1.6" />
              <line x1="0.5" y1="1.6" x2="2.5" y2="1.6" />
            </g>
            {/* Trigram Bottom-Left (Ri) */}
            <g transform="translate(6, 16) rotate(-34)" stroke="#000000" strokeWidth="0.7">
              <line x1="-2.5" y1="-1.6" x2="2.5" y2="-1.6" />
              <line x1="-2.5" y1="0" x2="-0.5" y2="0" />
              <line x1="0.5" y1="0" x2="2.5" y2="0" />
              <line x1="-2.5" y1="1.6" x2="2.5" y2="1.6" />
            </g>
            {/* Trigram Bottom-Right (Gon) */}
            <g transform="translate(24, 16) rotate(34)" stroke="#000000" strokeWidth="0.7">
              <line x1="-2.5" y1="-1.6" x2="-0.5" y2="-1.6" />
              <line x1="0.5" y1="-1.6" x2="2.5" y2="-1.6" />
              <line x1="-2.5" y1="0" x2="-0.5" y2="0" />
              <line x1="0.5" y1="0" x2="2.5" y2="0" />
              <line x1="-2.5" y1="1.6" x2="-0.5" y2="1.6" />
              <line x1="0.5" y1="1.6" x2="2.5" y2="1.6" />
            </g>
          </svg>
        );

      case 'id': // Indonesia: Red & White
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="1" fill="#E70011" />
            <rect width="3" height="1" y="1" fill="#FFFFFF" />
          </svg>
        );

      case 'us': // USA: Stripes & Canton
        return (
          <svg viewBox="0 0 19 10" className="w-full h-full object-cover">
            <rect width="19" height="10" fill="#B22234" />
            <path d="M0 1.54h19 M0 3.08h19 M0 4.62h19 M0 6.15h19 M0 7.69h19 M0 9.23h19" stroke="#FFFFFF" strokeWidth="0.77" />
            <rect width="7.6" height="5.38" fill="#3C3B6E" />
            <circle cx="3.8" cy="2.69" r="1.6" fill="#FFFFFF" opacity="0.9" />
          </svg>
        );

      case 'fr': // France: Blue, White, Red
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#002654" />
            <rect width="1" height="2" x="1" fill="#FFFFFF" />
            <rect width="1" height="2" x="2" fill="#ED2939" />
          </svg>
        );

      case 'cn': // China: Red with golden stars
        return (
          <svg viewBox="0 0 30 20" className="w-full h-full object-cover">
            <rect width="30" height="20" fill="#EE1C25" />
            <circle cx="5" cy="5" r="3" fill="#FFFF00" />
            <circle cx="10" cy="2" r="1" fill="#FFFF00" />
            <circle cx="12" cy="4" r="1" fill="#FFFF00" />
            <circle cx="12" cy="7" r="1" fill="#FFFF00" />
            <circle cx="10" cy="9" r="1" fill="#FFFF00" />
          </svg>
        );

      case 'th': // Thailand: Red, White, Blue, White, Red
        return (
          <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
            <rect width="6" height="4" fill="#A51931" />
            <rect width="6" height="2.66" y="0.67" fill="#F4F5F8" />
            <rect width="6" height="1.33" y="1.33" fill="#2D2A4A" />
          </svg>
        );

      case 'ru': // Russia: White, Blue, Red
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="0.67" fill="#FFFFFF" />
            <rect width="3" height="0.67" y="0.67" fill="#0039A6" />
            <rect width="3" height="0.67" y="1.33" fill="#D52B1E" />
          </svg>
        );

      case 'es': // Spain: Red, Yellow, Red
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="2" fill="#AA151B" />
            <rect width="3" height="1" y="0.5" fill="#F1BF00" />
          </svg>
        );

      case 'ae': // UAE: Green, White, Black with Red vertical hoist
        return (
          <svg viewBox="0 0 4 2" className="w-full h-full object-cover">
            <rect width="4" height="0.67" fill="#00732F" />
            <rect width="4" height="0.67" y="0.67" fill="#FFFFFF" />
            <rect width="4" height="0.67" y="1.33" fill="#000000" />
            <rect width="1" height="2" fill="#FF0000" />
          </svg>
        );

      case 'ng': // Nigeria: Green, White, Green
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#008751" />
            <rect width="1" height="2" x="1" fill="#FFFFFF" />
            <rect width="1" height="2" x="2" fill="#008751" />
          </svg>
        );

      default:
        // Generic fallback flag badge
        return (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white tracking-wider uppercase">
            {iso || 'UN'}
          </div>
        );
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] border border-black/15 shadow-sm shrink-0 select-none ${className}`}
      title={label}
      aria-label={label}
    >
      {renderFlag()}
    </span>
  );
}

export default CountryFlag;
