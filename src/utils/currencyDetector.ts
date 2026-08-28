export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  countryCode: string;
  countryName: string;
  supermarketDefault: string;
}

export const COMMON_CURRENCIES: CurrencyInfo[] = [
  { code: 'EUR', symbol: '€', name: 'Euro (€)', countryCode: 'ES', countryName: 'España / Europa', supermarketDefault: 'Mercadona' },
  { code: 'USD', symbol: '$ USD', name: 'Dólar Estadounidense ($)', countryCode: 'US', countryName: 'Estados Unidos', supermarketDefault: 'Trader Joe\'s' },
  { code: 'MXN', symbol: '$ MXN', name: 'Peso Mexicano ($)', countryCode: 'MX', countryName: 'México', supermarketDefault: 'Walmart' },
  { code: 'ARS', symbol: '$ ARS', name: 'Peso Argentino ($)', countryCode: 'AR', countryName: 'Argentina', supermarketDefault: 'Carrefour' },
  { code: 'COP', symbol: '$ COP', name: 'Peso Colombiano ($)', countryCode: 'CO', countryName: 'Colombia', supermarketDefault: 'Éxito' },
  { code: 'CLP', symbol: '$ CLP', name: 'Peso Chileno ($)', countryCode: 'CL', countryName: 'Chile', supermarketDefault: 'Lider (Walmart)' },
  { code: 'PEN', symbol: 'S/.', name: 'Sol Peruano (S/.)', countryCode: 'PE', countryName: 'Perú', supermarketDefault: 'Plaza Vea' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (£)', countryCode: 'GB', countryName: 'Reino Unido', supermarketDefault: 'Tesco' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño (R$)', countryCode: 'BR', countryName: 'Brasil', supermarketDefault: 'Pão de Açúcar' },
  { code: 'CAD', symbol: '$ CAD', name: 'Dólar Canadiense ($)', countryCode: 'CA', countryName: 'Canadá', supermarketDefault: 'Loblaws' },
];

/**
 * Detects currency from browser timezone, language, and Intl settings
 */
export function detectLocalCurrency(): {
  currencyCode: string;
  currencySymbol: string;
  countryCode: string;
  detectedSource: string;
} {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const userLocale = navigator.language || 'es-ES';

    // 1. Timezone-based detection (high reliability)
    if (timeZone.includes('Europe/Madrid') || timeZone.includes('Europe/Paris') || timeZone.includes('Europe/Berlin') || timeZone.includes('Europe/Rome') || timeZone.includes('Europe/Lisbon') || timeZone.includes('Europe/Amsterdam') || timeZone.includes('Atlantic/Canary')) {
      return { currencyCode: 'EUR', currencySymbol: '€', countryCode: 'ES', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Mexico_City') || timeZone.includes('America/Cancun') || timeZone.includes('America/Monterrey') || timeZone.includes('America/Tijuana')) {
      return { currencyCode: 'MXN', currencySymbol: '$ MXN', countryCode: 'MX', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Argentina') || timeZone.includes('America/Buenos_Aires') || timeZone.includes('America/Cordoba')) {
      return { currencyCode: 'ARS', currencySymbol: '$ ARS', countryCode: 'AR', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Bogota')) {
      return { currencyCode: 'COP', currencySymbol: '$ COP', countryCode: 'CO', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Santiago') || timeZone.includes('Pacific/Easter')) {
      return { currencyCode: 'CLP', currencySymbol: '$ CLP', countryCode: 'CL', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Lima')) {
      return { currencyCode: 'PEN', currencySymbol: 'S/.', countryCode: 'PE', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/New_York') || timeZone.includes('America/Chicago') || timeZone.includes('America/Los_Angeles') || timeZone.includes('America/Denver')) {
      return { currencyCode: 'USD', currencySymbol: '$ USD', countryCode: 'US', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('Europe/London')) {
      return { currencyCode: 'GBP', currencySymbol: '£', countryCode: 'GB', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Sao_Paulo') || timeZone.includes('America/Fortaleza')) {
      return { currencyCode: 'BRL', currencySymbol: 'R$', countryCode: 'BR', detectedSource: `Zona horaria (${timeZone})` };
    }
    if (timeZone.includes('America/Toronto') || timeZone.includes('America/Vancouver')) {
      return { currencyCode: 'CAD', currencySymbol: '$ CAD', countryCode: 'CA', detectedSource: `Zona horaria (${timeZone})` };
    }

    // 2. Locale region code fallback
    if (userLocale.includes('-MX')) return { currencyCode: 'MXN', currencySymbol: '$ MXN', countryCode: 'MX', detectedSource: `Idioma (${userLocale})` };
    if (userLocale.includes('-AR')) return { currencyCode: 'ARS', currencySymbol: '$ ARS', countryCode: 'AR', detectedSource: `Idioma (${userLocale})` };
    if (userLocale.includes('-CO')) return { currencyCode: 'COP', currencySymbol: '$ COP', countryCode: 'CO', detectedSource: `Idioma (${userLocale})` };
    if (userLocale.includes('-CL')) return { currencyCode: 'CLP', currencySymbol: '$ CLP', countryCode: 'CL', detectedSource: `Idioma (${userLocale})` };
    if (userLocale.includes('-PE')) return { currencyCode: 'PEN', currencySymbol: 'S/.', countryCode: 'PE', detectedSource: `Idioma (${userLocale})` };
    if (userLocale.includes('-ES')) return { currencyCode: 'EUR', currencySymbol: '€', countryCode: 'ES', detectedSource: `Idioma (${userLocale})` };
    if (userLocale.includes('-US') || userLocale.includes('en-US')) return { currencyCode: 'USD', currencySymbol: '$ USD', countryCode: 'US', detectedSource: `Idioma (${userLocale})` };

    return { currencyCode: 'EUR', currencySymbol: '€', countryCode: 'ES', detectedSource: 'Moneda estándar' };
  } catch (e) {
    return { currencyCode: 'EUR', currencySymbol: '€', countryCode: 'ES', detectedSource: 'Por defecto' };
  }
}

/**
 * Maps GPS latitude/longitude to matching currency and country
 */
export function getCurrencyFromCoordinates(lat: number, lng: number): {
  currencyCode: string;
  currencySymbol: string;
  countryCode: string;
  countryName: string;
  supermarket: string;
} {
  // España / Portugal / Western Europe
  if (lat >= 35 && lat <= 44 && lng >= -10 && lng <= 5) {
    return { currencyCode: 'EUR', currencySymbol: '€', countryCode: 'ES', countryName: 'España', supermarket: 'Mercadona' };
  }
  // México
  if (lat >= 14 && lat <= 33 && lng >= -118 && lng <= -86) {
    return { currencyCode: 'MXN', currencySymbol: '$ MXN', countryCode: 'MX', countryName: 'México', supermarket: 'Walmart' };
  }
  // Argentina
  if (lat >= -56 && lat <= -21 && lng >= -74 && lng <= -53) {
    return { currencyCode: 'ARS', currencySymbol: '$ ARS', countryCode: 'AR', countryName: 'Argentina', supermarket: 'Carrefour' };
  }
  // Colombia
  if (lat >= -5 && lat <= 13 && lng >= -80 && lng <= -66) {
    return { currencyCode: 'COP', currencySymbol: '$ COP', countryCode: 'CO', countryName: 'Colombia', supermarket: 'Éxito' };
  }
  // Chile
  if (lat >= -56 && lat <= -17 && lng >= -76 && lng <= -66) {
    return { currencyCode: 'CLP', currencySymbol: '$ CLP', countryCode: 'CL', countryName: 'Chile', supermarket: 'Lider (Walmart)' };
  }
  // Perú
  if (lat >= -19 && lat <= 0 && lng >= -82 && lng <= -68) {
    return { currencyCode: 'PEN', currencySymbol: 'S/.', countryCode: 'PE', countryName: 'Perú', supermarket: 'Plaza Vea' };
  }
  // EE.UU.
  if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) {
    return { currencyCode: 'USD', currencySymbol: '$ USD', countryCode: 'US', countryName: 'Estados Unidos', supermarket: 'Trader Joe\'s' };
  }
  // UK
  if (lat >= 49 && lat <= 60 && lng >= -8 && lng <= 2) {
    return { currencyCode: 'GBP', currencySymbol: '£', countryCode: 'GB', countryName: 'Reino Unido', supermarket: 'Tesco' };
  }

  // Fallback to detected timezone/locale
  const detected = detectLocalCurrency();
  const match = COMMON_CURRENCIES.find(c => c.code === detected.currencyCode) || COMMON_CURRENCIES[0];
  return {
    currencyCode: match.code,
    currencySymbol: match.symbol,
    countryCode: match.countryCode,
    countryName: match.countryName,
    supermarket: match.supermarketDefault
  };
}
