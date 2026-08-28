import { SupermarketOption } from '../types';

export interface CountrySupermarkets {
  countryCode: string;
  countryName: string;
  currency: string;
  supermarkets: SupermarketOption[];
}

export function extractBaseCurrencySymbol(currency: string): string {
  if (!currency) return '$';
  const trimmed = currency.trim();
  if (trimmed.includes('€') || trimmed.toUpperCase().includes('EUR')) return '€';
  if (trimmed.includes('£') || trimmed.toUpperCase().includes('GBP')) return '£';
  if (trimmed.includes('S/.') || trimmed.toUpperCase().includes('PEN')) return 'S/.';
  if (trimmed.includes('R$') || trimmed.toUpperCase().includes('BRL')) return 'R$';
  if (trimmed.includes('¥') || trimmed.toUpperCase().includes('JPY')) return '¥';
  if (trimmed.includes('$')) return '$';
  return trimmed.slice(0, 3);
}

export function getSupermarketTierIndicator(supermarket: SupermarketOption, currency: string): string {
  const base = extractBaseCurrencySymbol(currency);
  const count = supermarket.tierLevel || 2;
  if (base === 'S/.') {
    return Array(count).fill('S/.').join(' ');
  }
  return base.repeat(count);
}

export function getSupermarketDisplayLabel(supermarket: SupermarketOption, currency: string): string {
  const tierStr = getSupermarketTierIndicator(supermarket, currency);
  return `${supermarket.name} - Nivel ${tierStr} (${supermarket.category})`;
}

export const REGIONAL_SUPERMARKETS: CountrySupermarkets[] = [
  {
    countryCode: 'ES',
    countryName: 'España',
    currency: '€',
    supermarkets: [
      {
        name: 'Mercadona',
        country: 'España',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Hacendado',
        logoColor: '#007A33',
        savingsTips: [
          'Aprovecha los productos de marca Hacendado para legumbres, lácteos y avena con gran relación calidad-precio.',
          'Revisa las bajadas de precio por fecha de consumo próximo en carnes y pescados a última hora de la tarde.',
          'Los formatos familiares de pechuga de pollo y congelados (merluza, salmón) reducen el coste por ración.'
        ]
      },
      {
        name: 'Carrefour',
        country: 'España',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Carrefour / Carrefour BIO',
        logoColor: '#0055A5',
        savingsTips: [
          'Activa la app Mi Carrefour y aprovecha las promociones "2ª unidad al 70%" o "3x2" en despensa.',
          'Usa los cheques ahorro acumulados del Club Carrefour y el 1% en compras de frescos.',
          'Las marcas blancas Carrefour Classic y Carrefour BIO ofrecen excelentes macros a precios competitivos.'
        ]
      },
      {
        name: 'Lidl',
        country: 'España',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Milbona / Freshona',
        logoColor: '#0050AA',
        savingsTips: [
          'Consulta el folleto digital y los cupones semanales de la app Lidl Plus antes de ir.',
          'La marca Milbona ofrece los mejores precios en yogur griego, queso fresco batido y kéfir.',
          'Los fines de semana tienen ofertas "Súper Sábado" con rebajas de hasta el 50% en frutas y carnes.'
        ]
      },
      {
        name: 'Día',
        country: 'España',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Día / Delicious',
        logoColor: '#D81E05',
        savingsTips: [
          'Usa la tarjeta Club Día para aplicar cupones personalizados de hasta un 25% en frescos y lácteos.',
          'Compra productos de la nueva gama Día con sello de calidad asegurada a precio de descuento.',
          'Las ofertas flash de mitad de semana en frutas de temporada permiten gran ahorro.'
        ]
      },
      {
        name: 'Alcampo',
        country: 'España',
        category: 'hipermercado',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Auchan / Pulgar',
        logoColor: '#E2001A',
        savingsTips: [
          'Alcampo suele liderar los rankings de la OCU en precios más bajos en cesta básica e hipermercado.',
          'Compra granos, arroces, legumbres y frutos secos en formatos a granel para pagar solo lo necesario.',
          'La gama Auchan Selección ofrece cortes de carnicería magros a precios directos.'
        ]
      },
      {
        name: 'Eroski',
        country: 'España',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Eroski / Eroski Basic',
        logoColor: '#004B87',
        savingsTips: [
          'Hazte socio de Eroski Club para sumar saldo en tu Monedero en compras de frescos y productos locales.',
          'Aprovecha el "Compromiso ahorro" que iguala precios con competidores directos.',
          'La marca Eroski Natur destaca en frutas y verduras de proximidad.'
        ]
      },
      {
        name: 'Consum',
        country: 'España',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Consum',
        logoColor: '#EA5B0C',
        savingsTips: [
          'Aprovecha el cheque-regalo mensual para socios clientes con descuentos directos.',
          'Gran calidad en su mostrador de carnicería y pescadería fresca al corte.'
        ]
      },
      {
        name: 'Aldi',
        country: 'España',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'GutBio / Milsani',
        logoColor: '#00205B',
        savingsTips: [
          'Consulta los "Especiales de la semana" los miércoles y sábados con descuentos en frescos.',
          'La marca GutBio tiene productos ecológicos al precio de marcas convencionales.'
        ]
      },
      {
        name: 'El Corte Inglés / Hipercor',
        country: 'España',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'El Corte Inglés',
        logoColor: '#006633',
        savingsTips: [
          'Aprovecha las campañas "Límite 48 horas" y promociones en su catálogo online para productos gourmet.',
          'Máxima frescura y trazabilidad garantizada en pescadería y carnicería selecta.'
        ]
      },
      {
        name: 'Ahorramas',
        country: 'España',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Alipende',
        logoColor: '#E30613',
        savingsTips: [
          'Especialistas en producto fresco de mostrador tradicional con excelente rotación.',
          'La marca Alipende ofrece conservas y despensa a precios muy contenidos.'
        ]
      },
      {
        name: 'Mercado Local / Frutería de Barrio',
        country: 'España',
        category: 'local',
        tierLevel: 2,
        isEcommerce: false,
        brandName: 'Comercio de Proximidad',
        logoColor: '#16A34A',
        savingsTips: [
          'Pregunta al tendero por los productos de temporada en su punto óptimo de maduración y precio.',
          'Pide cortes exactos en carnicería y pescadería para no desperdiciar gramos ni pagar de más.',
          'Comprar a granel evita costes de empaquetado y plástico innecesarios.'
        ]
      }
    ]
  },
  {
    countryCode: 'AR',
    countryName: 'Argentina',
    currency: '$ ARS',
    supermarkets: [
      {
        name: 'Carrefour',
        country: 'Argentina',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Carrefour',
        logoColor: '#0055A5',
        savingsTips: [
          'Descarga la app Mi Carrefour para acceder a descuentos bancarios semanales y 2da unidad al 70% o 80%.',
          'Los productos marca Carrefour (arroz, fideos, atún, lácteos) tienen precios congelados y gran calidad.',
          'Aprovecha los "Días Carrefour" con promociones en carnes y verduras online.'
        ]
      },
      {
        name: 'Coto',
        country: 'Argentina',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Coto / Ciudad del Lago',
        logoColor: '#D91A1E',
        savingsTips: [
          'Revisa las ofertas de Coto Digital en días de descuentos con tarjetas bancarias (hasta 20%-25% de reintegro).',
          'Coto es líder en cortes de carne vacuna fresca y pollo con carnicería propia de alta rotación.',
          'La marca Ciudad del Lago ofrece conservas y legumbres a precios muy accesibles.'
        ]
      },
      {
        name: 'Jumbo',
        country: 'Argentina',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'Cuisine & Co',
        logoColor: '#00873D',
        savingsTips: [
          'Usa el programa Jumbo Prime para envíos gratis y ofertas exclusivas de fin de semana.',
          'La marca Cuisine & Co ofrece productos de alta gama a precio de marca blanca.',
          'Excelente selección de pescadería y productos importados o sin gluten.'
        ]
      },
      {
        name: 'Día',
        country: 'Argentina',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Día',
        logoColor: '#D81E05',
        savingsTips: [
          'Aprovecha los cupones personalizados de la App Club Día y las ofertas "2x1" y "3x2".',
          'La marca Día es famosa por sus precios ultra económicos en avena, frutos secos, atún y lácteos.',
          'Monitorea los días de descuento con billeteras virtuales (Mercado Pago, Cuenta DNI, MODO).'
        ]
      },
      {
        name: 'Vea',
        country: 'Argentina',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Vea / Cuisine & Co',
        logoColor: '#E30613',
        savingsTips: [
          'Aprovecha los "Súper Miércoles" y "Vea Ahorro" con rebajas en canasta familiar.',
          'Buenos precios en frutas, verduras y pollo en packs económicos.'
        ]
      },
      {
        name: 'Disco',
        country: 'Argentina',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Cuisine & Co / Disco',
        logoColor: '#ED1C24',
        savingsTips: [
          'Aprovecha las promociones de Disco Online con beneficios de fidelidad y reintegros bancarios.',
          'Muy buena frescura en panadería artesanal y productos listos para cocinar.'
        ]
      },
      {
        name: 'Verdulería y Carnicería de Barrio',
        country: 'Argentina',
        category: 'local',
        tierLevel: 2,
        isEcommerce: false,
        brandName: 'Comercio Local',
        logoColor: '#16A34A',
        savingsTips: [
          'Las verdulerías de barrio ofrecen bolsones de verduras y frutas de estación con hasta un 40% de ahorro.',
          'En la carnicería amiga puedes pedir que desgrasen y corten la pechuga o bife en porciones listas para congelar.',
          'Pagando en efectivo o transferencia local sueles conseguir descuentos del 10% al 15%.'
        ]
      }
    ]
  },
  {
    countryCode: 'MX',
    countryName: 'México',
    currency: '$ MXN',
    supermarkets: [
      {
        name: 'Walmart',
        country: 'México',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Great Value',
        logoColor: '#0071CE',
        savingsTips: [
          'La marca Great Value ofrece excelentes precios en avena, atún, claras de huevo y vegetales congelados.',
          'Aprovecha el "Martes de Frescura" en Walmart con descuentos agresivos en frutas, verduras y carnes.',
          'Usa el servicio Pickup de Walmart Online para evitar gastos de envío y compras por impulso.'
        ]
      },
      {
        name: 'Chedraui',
        country: 'México',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Chedraui',
        logoColor: '#E31B23',
        savingsTips: [
          'El "Martimiércoles de Chedraui" ofrece las frutas y verduras más baratas del mercado mexicano.',
          'Acumula saldo en tu monedero MiChedraui en productos seleccionados y marcas propias.',
          'Compara precios con su garantía "Chedraui te cuesta menos".'
        ]
      },
      {
        name: 'Soriana',
        country: 'México',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Soriana / Precíssimo',
        logoColor: '#ED1C24',
        savingsTips: [
          'Usa la tarjeta Recompensas Soriana para canjear puntos por productos gratis o con descuento.',
          'La marca Precíssimo es ideal para granos básicos, arroz, frijoles y pastas a precio mínimo.',
          'Aprovecha las campañas "Julio Regalado" y promociones 3x2 en abarrotes.'
        ]
      },
      {
        name: 'Bodega Aurrera',
        country: 'México',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Aurrera / Great Value',
        logoColor: '#00853F',
        savingsTips: [
          'Líder en precios bajos para despensa básica con "El Campeón de los Precios Bajos".',
          'Los productos básicos de la marca Aurrera garantizan el costo por porción más bajo.',
          'Ideal para comprar huevo por cono (30 piezas) y frijol a granel.'
        ]
      },
      {
        name: 'La Comer / Fresko',
        country: 'México',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'Golden Hills',
        logoColor: '#FF6600',
        savingsTips: [
          'Aprovecha el "Miércoles de Plaza" para conseguir la máxima calidad en frutas y legumbres selectas.',
          'La marca propia Golden Hills ofrece gran nivel gourmet a precio moderado.',
          'Excelente selección de salmón fresco, carnes premium y productos orgánicos.'
        ]
      },
      {
        name: 'Costco',
        country: 'México',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Kirkland Signature',
        logoColor: '#E31837',
        savingsTips: [
          'Comprar pollo pechuga Kirkland, salmón y frutos secos en volumen ahorra hasta 30% a largo plazo.',
          'Separa y congela en porciones individuales el mismo día de la compra.'
        ]
      },
      {
        name: 'H-E-B',
        country: 'México',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'H-E-B / Hill Country Fare',
        logoColor: '#ED1B2D',
        savingsTips: [
          'Revisa los "Combos Locos" y promociones semanales en la app H-E-B.',
          'La marca Hill Country Fare ofrece gran economía en básicos de despensa.'
        ]
      },
      {
        name: 'Mercado Tradicional / Tianguis',
        country: 'México',
        category: 'local',
        tierLevel: 1,
        isEcommerce: false,
        brandName: 'Comercio Local',
        logoColor: '#16A34A',
        savingsTips: [
          'Compra verduras, aguacates y frutas por kilo directamente a productores locales.',
          'En el tianguis consigues hierbas de olor, chiles secos y semillas al precio más bajo por gramo.',
          'Acudir temprano garantiza frescura y mejores opciones de selección.'
        ]
      }
    ]
  },
  {
    countryCode: 'CO',
    countryName: 'Colombia',
    currency: '$ COP',
    supermarkets: [
      {
        name: 'Éxito',
        country: 'Colombia',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Éxito / Ekono',
        logoColor: '#FFDD00',
        savingsTips: [
          'Aprovecha los "Miércoles de Plaza" para comprar frutas y verduras con hasta 25% de descuento.',
          'Usa los Puntos Colombia para pagar parte de tu mercado en caja o en Éxito.com.',
          'La marca propia Éxito ofrece productos de despensa con excelente balance precio-calidad.'
        ]
      },
      {
        name: 'D1',
        country: 'Colombia',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Marcas Propias D1',
        logoColor: '#E30613',
        savingsTips: [
          'Precios imbatibles en avena, atún, pastas, huevos y frutos secos.',
          'Comprar los básicos de despensa en D1 puede reducir la factura mensual hasta en un 35%.',
          'Los lácteos y quesos frescos tienen precios muy por debajo del promedio nacional.'
        ]
      },
      {
        name: 'Tiendas Ara',
        country: 'Colombia',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Marcas Propias Ara',
        logoColor: '#FF6600',
        savingsTips: [
          'Monitorea los "Precios Imbatibles" y promociones por volumen en carnicería y pollo fresco.',
          'Excelente relación calidad-precio en granos, arroz, lentejas y aceite vegetal.'
        ]
      },
      {
        name: 'Carulla',
        country: 'Colombia',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'Carulla / Pomona',
        logoColor: '#00843D',
        savingsTips: [
          'Aprovecha el "Viernes de Celebración" y días de descuento con tarjetas bancarias aliadas.',
          'Líder en pescados frescos, cortes madurados y verduras hidropónicas selectas.'
        ]
      },
      {
        name: 'Jumbo',
        country: 'Colombia',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Cuisine & Co',
        logoColor: '#00873D',
        savingsTips: [
          'Revisa los "Días de Campo" para descuentos en frutas y carnicería premium.',
          'La marca Cuisine & Co tiene opciones saludables de granola, frutos secos y aceite de oliva.'
        ]
      },
      {
        name: 'Plaza de Mercado / Tienda de Barrio',
        country: 'Colombia',
        category: 'local',
        tierLevel: 1,
        isEcommerce: false,
        brandName: 'Plaza Tradicional',
        logoColor: '#16A34A',
        savingsTips: [
          'En plazas de mercado (Paloquemao, Corabastos, etc.) consigues aguacate, plátano y frutas exóticas a mitad de precio.',
          'La compra por docenas o atados permite gran ahorro en hierbas aromáticas y hortalizas.'
        ]
      }
    ]
  },
  {
    countryCode: 'CL',
    countryName: 'Chile',
    currency: '$ CLP',
    supermarkets: [
      {
        name: 'Lider (Walmart)',
        country: 'Chile',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Lider / Great Value',
        logoColor: '#0071CE',
        savingsTips: [
          'Aprovecha la campaña "Productos a Mil / Dos Mil" y las ofertas de Lider.cl.',
          'La marca Great Value y Lider ofrece gran economía en avena, atún, arroz y legumbres.',
          'Descuentos adicionales al pagar con tarjeta Lider Bci.'
        ]
      },
      {
        name: 'Jumbo',
        country: 'Chile',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'Cuisine & Co',
        logoColor: '#00873D',
        savingsTips: [
          'Suscríbete a Jumbo Prime para despacho gratis y promociones exclusivas en frescos.',
          'Máxima calidad en pescadería fresca (salmón chileno, reineta) y carnes prémium.',
          'La marca Cuisine & Co ofrece gran calidad en frutos secos y despensa.'
        ]
      },
      {
        name: 'Santa Isabel',
        country: 'Chile',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Máxima / Cuisine & Co',
        logoColor: '#ED1C24',
        savingsTips: [
          'Revisa las "Ofertas del Día" y promociones para socios Puntos Cencosud.',
          'Buena opción para compras rápidas de cercanía con precios accesibles.'
        ]
      },
      {
        name: 'Unimarc',
        country: 'Chile',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Nuestra Tierra',
        logoColor: '#E30613',
        savingsTips: [
          'Aprovecha la app Club Unimarc con cupones personalizados en carnes y abarrotes.',
          'El "Día del Asado" y ofertas de fin de semana tienen descuentos destacados en carnes.'
        ]
      },
      {
        name: 'Tottus',
        country: 'Chile',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Tottus',
        logoColor: '#84BD00',
        savingsTips: [
          'Acumula puntos CMR Falabella y accede a descuentos exclusivos pagando con tarjeta CMR.',
          'La marca Tottus tiene precios muy competitivos en despensa y congelados.'
        ]
      },
      {
        name: 'Feria Libre / Verdulería Local',
        country: 'Chile',
        category: 'local',
        tierLevel: 1,
        isEcommerce: false,
        brandName: 'Comercio Local',
        logoColor: '#16A34A',
        savingsTips: [
          'Las ferias libres son la mejor opción en Chile para comprar frutas, verduras y huevos al mejor precio.',
          'Comprar hacia el final de la jornada de feria permite acceder a ofertas por cajón o bolsa.'
        ]
      }
    ]
  },
  {
    countryCode: 'PE',
    countryName: 'Perú',
    currency: 'S/.',
    supermarkets: [
      {
        name: 'Plaza Vea',
        country: 'Perú',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Bells / Plaza Vea',
        logoColor: '#ED1C24',
        savingsTips: [
          'Aprovecha los "Precios Bajos Todos los Días" y días Oh! con tarjeta Oh.',
          'La marca Bells ofrece gran ahorro en avena, arroz, conservas de atún y menestras.',
          'Revisa las ofertas de frutas y verduras los martes y miércoles.'
        ]
      },
      {
        name: 'Wong',
        country: 'Perú',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'Wong / Cuisine & Co',
        logoColor: '#FFDD00',
        savingsTips: [
          'Excelente calidad en pescadería fresca, cortes finos de carne y frutas seleccionadas.',
          'Acumula puntos Bonus y aprovecha los Días Cencosud para descuentos especiales.'
        ]
      },
      {
        name: 'Metro',
        country: 'Perú',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Metro / Máxima',
        logoColor: '#0055A5',
        savingsTips: [
          'Revisa las promociones de "Súper Metro" en abarrotes y productos de consumo masivo.',
          'Buenas ofertas en pollos enteros y menestras envasadas.'
        ]
      },
      {
        name: 'Tottus',
        country: 'Perú',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Tottus / Precio Uno',
        logoColor: '#84BD00',
        savingsTips: [
          'Descuentos destacados al pagar con tarjeta CMR o débito Banco Falabella.',
          'La marca Precio Uno ofrece el costo más bajo en básicos de despensa.'
        ]
      },
      {
        name: 'Vivanda',
        country: 'Perú',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: 'Vivanda Selección',
        logoColor: '#FF6600',
        savingsTips: [
          'Gama alta en productos frescos, orgánicos y gourmet.',
          'Aprovecha promociones online en compras programadas.'
        ]
      },
      {
        name: 'Mercado de Abastos / Feria Local',
        country: 'Perú',
        category: 'local',
        tierLevel: 1,
        isEcommerce: false,
        brandName: 'Mercado Tradicional',
        logoColor: '#16A34A',
        savingsTips: [
          'En mercados como Surquillo o Productores consigues la máxima variedad de tubérculos, quinua y pescado fresco.',
          'Comprar menestras y granos a granel reduce el costo a casi la mitad comparado con empaques comerciales.'
        ]
      }
    ]
  },
  {
    countryCode: 'US',
    countryName: 'Estados Unidos',
    currency: '$ USD',
    supermarkets: [
      {
        name: 'Trader Joe\'s',
        country: 'Estados Unidos',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: false,
        brandName: 'Trader Joe\'s',
        logoColor: '#D81E05',
        savingsTips: [
          'Precios estables todo el año sin necesidad de cupones ni membresías.',
          'Gran selección de frutos secos, avena orgánica, yogur griego y verduras listas para saltear.'
        ]
      },
      {
        name: 'Costco',
        country: 'Estados Unidos',
        category: 'hipermercado',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Kirkland Signature',
        logoColor: '#E31837',
        savingsTips: [
          'Comprar en volumen pechuga de pollo orgánica, salmón silvestre y huevos ahorra hasta 35%.',
          'Divide las porciones y congélalas en bolsas herméticas al llegar a casa.'
        ]
      },
      {
        name: 'Whole Foods Market',
        country: 'Estados Unidos',
        category: 'premium',
        tierLevel: 3,
        isEcommerce: true,
        brandName: '365 by Whole Foods Market',
        logoColor: '#006644',
        savingsTips: [
          'Los miembros de Amazon Prime obtienen un 10% de descuento adicional en ofertas amarillas.',
          'La marca propia 365 ofrece productos orgánicos al precio de marcas convencionales.'
        ]
      },
      {
        name: 'Walmart Supercenter',
        country: 'Estados Unidos',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Great Value',
        logoColor: '#0071CE',
        savingsTips: [
          'La marca Great Value ofrece los precios más bajos en avena, atún y verduras congeladas.',
          'Usa Walmart Grocery Pickup para ahorrar tiempo y controlar el gasto en tiempo real.'
        ]
      },
      {
        name: 'ALDI',
        country: 'Estados Unidos',
        category: 'descuento',
        tierLevel: 1,
        isEcommerce: true,
        brandName: 'Simply Nature / Friendly Farms',
        logoColor: '#00205B',
        savingsTips: [
          'Uno de los supermercados más económicos de EE.UU. con marcas propias de alta calidad.',
          'Los "ALDI Finds" de los miércoles ofrecen grandes ofertas en carnes y productos de temporada.'
        ]
      },
      {
        name: 'Target Grocery',
        country: 'Estados Unidos',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Good & Gather',
        logoColor: '#CC0000',
        savingsTips: [
          'Aprovecha el 5% de descuento directo con Target Circle Card y cupones de la app Target.',
          'La marca Good & Gather tiene excelentes estándares sin sabores artificiales ni jarabe de maíz.'
        ]
      },
      {
        name: 'Kroger',
        country: 'Estados Unidos',
        category: 'popular',
        tierLevel: 2,
        isEcommerce: true,
        brandName: 'Kroger / Simple Truth',
        logoColor: '#0055A5',
        savingsTips: [
          'Descarga cupones digitales en la app Kroger y aprovecha las ofertas semanales "Mega Event".',
          'La línea Simple Truth ofrece productos orgánicos certificados a precios accesibles.'
        ]
      },
      {
        name: 'Local Farmer\'s Market',
        country: 'Estados Unidos',
        category: 'local',
        tierLevel: 2,
        isEcommerce: false,
        brandName: 'Local Producers',
        logoColor: '#16A34A',
        savingsTips: [
          'Compra productos directamente de granjas locales en su momento de mayor frescura.',
          'Comprar por cajas o hacia el cierre del mercado suele permitir mejores tratos.'
        ]
      }
    ]
  }
];

export const DEFAULT_EXCLUDED_FOOD_TAGS = [
  'Mariscos',
  'Cerdo',
  'Cilantro',
  'Lácteos / Lactosa',
  'Gluten / Trigo',
  'Frutos secos',
  'Huevo',
  'Soja',
  'Picante',
  'Pescado azul',
  'Cebolla cruda',
  'Berenjena',
  'Carne roja',
  'Azúcar añadido'
];

export const DIETARY_PREFERENCES = [
  { id: 'mediterranea', name: 'Dieta Mediterránea', desc: 'Rica en aceite de oliva, verduras, pescados y legumbres.' },
  { id: 'equilibrada', name: 'Equilibrada y Variada', desc: 'Todo tipo de alimentos en porciones balanceadas.' },
  { id: 'vegetariana', name: 'Vegetariana', desc: 'Sin carnes ni pescados, incluye huevos y lácteos.' },
  { id: 'vegana', name: '100% Vegana', desc: 'Basada exclusivamente en alimentos de origen vegetal.' },
  { id: 'alta_proteina', name: 'Alta en Proteína', desc: 'Enfoque en pollo, pavo, pescado, claras, legumbres y tofu.' },
  { id: 'baja_carbohidratos', name: 'Baja en Carbohidratos / Low Carb', desc: 'Reduce harinas, pastas y azúcares simples.' },
  { id: 'keto', name: 'Cetogénica (Keto)', desc: 'Grasas saludables altas y carbohidratos mínimos (<30g).' },
  { id: 'sin_gluten', name: 'Sin Gluten (Apta celíacos)', desc: 'Cereales sin gluten (arroz, quinoa, patata, avena sin gluten).' },
  { id: 'batch_cooking', name: 'Especial Batch Cooking / Fiambrera', desc: 'Recetas que se conservan excelente para llevar al trabajo.' },
  { id: 'economica', name: 'Económica / Ahorro inteligente', desc: 'Prioriza ingredientes de temporada y costo accesible.' }
];

export interface RegionalIngredientProfile {
  regionCode: string;
  regionName: string;
  terms: {
    avocado: string;
    sweetPotato: string;
    zucchini: string;
    greenBeans: string;
    beans: string;
    banana: string;
    strawberry: string;
    freshCheese: string;
    beef: string;
    peppers: string;
    corn: string;
    cream: string;
    butter: string;
    shrimp: string;
    potatoes: string;
    bread: string;
  };
  supermarketInventoryHighlights: Record<string, string>;
  rulesPromptSnippet: string;
}

export const REGIONAL_INGREDIENT_PROFILES: Record<string, RegionalIngredientProfile> = {
  AR: {
    regionCode: 'AR',
    regionName: 'Argentina',
    terms: {
      avocado: 'Palta',
      sweetPotato: 'Batata',
      zucchini: 'Zucchini / Zapallito',
      greenBeans: 'Chauchas',
      beans: 'Porotos (alubias, negros, colorados)',
      banana: 'Banana',
      strawberry: 'Frutillas',
      freshCheese: 'Ricota / Queso Port Salut / Cremoso magro',
      beef: 'Carne vacuna (bife de chorizo, peceto, nalga, lomo, bola de lomo, carne picada especial magra)',
      peppers: 'Morrón (rojo, verde o amarillo)',
      corn: 'Choclo',
      cream: 'Crema de leche',
      butter: 'Manteca',
      shrimp: 'Langostinos / Camarones',
      potatoes: 'Papas',
      bread: 'Pan de salvado / Pan 100% integral / Galletas de arroz'
    },
    supermarketInventoryHighlights: {
      'Coto': 'Carnicería Coto (bife de chorizo, peceto, pechuga fresca), marca Ciudad del Lago (atún, arroz, fideos, legumbres), lácteos La Serenísima / Ilolay, huevos de campo x30.',
      'Carrefour': 'Línea Carrefour (avena, atún al natural, queso untable descremado, fideos secos), cortes en bandeja Carrefour, pechuga de pollo fileteada.',
      'Jumbo': 'Marca Cuisine & Co (legumbres secas, atún en lomos, semillas, frutos secos), pescadería selecta (salmón fresco, merluza), lácteos La Paulina / La Serenísima.',
      'Día': 'Marca Día (avena instantánea, atún en lata, fideos integrales, galletas de arroz, queso port salut), huevos x30 a precio descuento.',
      'Vea': 'Marca Vea y Cuisine & Co, ofertas en pollo trozado, bolsones de verduras y frutas de estación.',
      'Verdulería y Carnicería de Barrio': 'Bolsones de verdura fresca de estación, pechuga de pollo deshuesada al peso, bife magro cortado fino.'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA ARGENTINA:
- Usa SIEMPRE "Palta" (NUNCA "aguacate").
- Usa SIEMPRE "Batata" (NUNCA "boniato" ni "camote").
- Usa SIEMPRE "Zucchini" o "Zapallito" (NUNCA "calabacín").
- Usa SIEMPRE "Chauchas" (NUNCA "judías verdes" ni "ejotes").
- Usa SIEMPRE "Porotos" (NUNCA "alubias" ni "frijoles").
- Usa SIEMPRE "Banana" (NUNCA "plátano").
- Usa SIEMPRE "Frutillas" (NUNCA "fresas").
- Usa SIEMPRE "Ricota" o "Queso Port Salut" (NUNCA "requesón").
- Usa SIEMPRE cortes vacunos argentinos: "Bife de chorizo", "Peceto", "Nalga", "Lomo", "Carne picada especial" (NUNCA "ternera").
- Usa SIEMPRE "Morrón" (NUNCA "pimiento").
- Usa SIEMPRE "Choclo" (NUNCA "maíz" o "elote").
- Usa SIEMPRE "Manteca" (NUNCA "mantequilla") y "Crema de leche" (NUNCA "nata").
- Usa SIEMPRE "Papas" (NUNCA "patatas") y "Jugo" (NUNCA "zumo").`
  },
  MX: {
    regionCode: 'MX',
    regionName: 'México',
    terms: {
      avocado: 'Aguacate (Hass)',
      sweetPotato: 'Camote',
      zucchini: 'Calabacita',
      greenBeans: 'Ejotes',
      beans: 'Frijoles (negros, bayos, flor de mayo, peruanos)',
      banana: 'Plátano (tabasco o dominico)',
      strawberry: 'Fresas',
      freshCheese: 'Queso Panela / Requesón fresco / Queso Oaxaca deshebrado',
      beef: 'Carne de res (bistec de res, arrachera magra, molida de sirloin 90/10, pulpa negra)',
      peppers: 'Pimiento morrón / Chile poblano / Chiles serranos',
      corn: 'Elote / Granos de elote',
      cream: 'Media crema / Crema ácida',
      butter: 'Mantequilla sin sal',
      shrimp: 'Camarones pacotilla o medianos',
      potatoes: 'Papas',
      bread: 'Tortillas de maíz / Tortillas de nopal / Pan integral'
    },
    supermarketInventoryHighlights: {
      'Walmart': 'Marca Great Value (avena hojuelas, atún en agua, frijoles negros, vegetales congelados, arroz), huevo San Juan / Bachoco x30, pechuga de pollo Bachoco, queso panela Nochebuena / Lala.',
      'Bodega Aurrera': 'Marca Aurrera y Great Value, huevo por cono (30 pzs), frijol a granel, pechuga de pollo fresca, atún Aurrera.',
      'Chedraui': 'Marca Chedraui, pechuga de pollo Selecto, verduras del Martimiércoles, atún Dolores, frijoles La Costeña.',
      'Soriana': 'Marca Precíssimo y Soriana (arroz, frijol, pastas), pechuga de pollo fresca, huevo El Calvario, bistec de res pulpa.',
      'La Comer / Fresko': 'Marca Golden Hills (semillas, frutos secos, avena, atún), salmón fresco, pechuga orgánica, aguacate Hass supreme.',
      'Costco': 'Kirkland Signature (pechuga de pollo congelada, salmón atlántico, claras de huevo en brik, frutos secos y avena en gran formato).',
      'Mercado Tradicional / Tianguis': 'Nopal fresco picado, jitomate, chile poblano, frijol a granel, aguacate por kilo, camarón fresco.'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA MÉXICO:
- Usa SIEMPRE "Aguacate" o "Aguacate Hass" (NUNCA "palta").
- Usa SIEMPRE "Camote" (NUNCA "boniato" ni "batata").
- Usa SIEMPRE "Calabacita" (NUNCA "calabacín" ni "zucchini").
- Usa SIEMPRE "Ejotes" (NUNCA "judías verdes" ni "chauchas").
- Usa SIEMPRE "Frijoles" (negros, bayos) (NUNCA "alubias" ni "porotos").
- Usa SIEMPRE "Queso Panela", "Requesón" o "Queso Oaxaca" (NUNCA "queso fresco batido").
- Usa SIEMPRE cortes de res: "Bistec de res", "Arrachera magra", "Molida de sirloin" (NUNCA "ternera").
- Usa SIEMPRE "Pimiento morrón", "Chile poblano", "Jitomate" (NUNCA "tomate" a secas si es rojo).
- Usa SIEMPRE "Elote" (NUNCA "maíz" o "choclo").
- Incorpora opciones con "Tortillas de maíz", "Tortillas de nopal", "Nopales asados" y "Frijoles de olla".`
  },
  CO: {
    regionCode: 'CO',
    regionName: 'Colombia',
    terms: {
      avocado: 'Aguacate (papelillo o hass)',
      sweetPotato: 'Batata',
      zucchini: 'Calabacín / Zucchini',
      greenBeans: 'Habichuelas',
      beans: 'Fríjoles (rojos, bola roja, cargamanto, negros)',
      banana: 'Banano (fruta) / Plátano maduro o verde (cocinado)',
      strawberry: 'Fresas',
      freshCheese: 'Cuajada / Queso campesino / Ricotta',
      beef: 'Carne de res (lomo fino, cadera, tabla, posta, carne molida magra especial)',
      peppers: 'Pimentón (rojo o verde)',
      corn: 'Mazorca / Maíz tierno',
      cream: 'Crema de leche',
      butter: 'Mantequilla',
      shrimp: 'Camarones',
      potatoes: 'Papas (pastusa, criolla o sabanera)',
      bread: 'Arepas de maíz 100% / Pan tajado integral'
    },
    supermarketInventoryHighlights: {
      'Éxito': 'Marca Éxito y Ekono (granos, arroz, avena), pechuga de pollo Bucanero/Pimpollo, carne Certificada Éxito, huevos Santa Reyes o Kikes, leche Alpina/Colanta.',
      'D1': 'Marca propia D1 (avena en hojuelas D1, atún D1 en agua, pasta D1, huevos Latti x30, queso campesino Latti, pechuga congelada D1).',
      'Tiendas Ara': 'Marca propia Ara, lácteos Deliz, pechuga y huevos Ara a precio económico.',
      'Carulla': 'Línea Pomona / Taeq (quinua, semillas, productos saludables fit), salmón noruego fresco, carnes maduradas.',
      'Jumbo': 'Marca Cuisine & Co (avena, atún en lomos, legumbres, aceite de oliva), carnes seleccionadas.'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA COLOMBIA:
- Usa SIEMPRE "Aguacate" (papelillo o hass).
- Usa SIEMPRE "Habichuelas" (NUNCA "judías verdes" ni "chauchas").
- Usa SIEMPRE "Fríjoles" (rojos, cargamanto o negros) (NUNCA "alubias" ni "porotos").
- Usa SIEMPRE "Banano" para la fruta de desayuno y "Plátano maduro / verde" para cocinar (NUNCA "plátano" genérico).
- Usa SIEMPRE "Cuajada" o "Queso campesino" (NUNCA "requesón" ni "queso feta").
- Usa SIEMPRE "Carne de res", "Lomo fino", "Cadera", "Carne molida magra" (NUNCA "ternera").
- Usa SIEMPRE "Pimentón" (NUNCA "pimiento" ni "morrón").
- Usa SIEMPRE "Mazorca" o "Maíz tierno" (NUNCA "choclo" ni "elote").
- Usa SIEMPRE "Papa criolla" o "Papa pastusa" e incluye "Arepas de maíz" o "Pan tajado integral".`
  },
  CL: {
    regionCode: 'CL',
    regionName: 'Chile',
    terms: {
      avocado: 'Palta (Hass)',
      sweetPotato: 'Camote',
      zucchini: 'Zapallo italiano',
      greenBeans: 'Porotos verdes',
      beans: 'Porotos (tórtola, burros, negros)',
      banana: 'Plátano',
      strawberry: 'Frutillas',
      freshCheese: 'Quesillo / Ricotta',
      beef: 'Vacuno (posta negra, posta rosada, lomo liso, carne molida tártaro 4% o 10%)',
      peppers: 'Pimentón (rojo, verde)',
      corn: 'Choclo',
      cream: 'Crema espesa / Crema',
      butter: 'Mantequilla sin sal',
      shrimp: 'Camarones',
      potatoes: 'Papas',
      bread: 'Pan 100% integral / Marraqueta integral / Galletas de arroz'
    },
    supermarketInventoryHighlights: {
      'Líder': 'Marca Great Value y Selección Líder (avena instantánea, atún en agua, arroz, porotos), pechuga de pollo Super Pollo / Arizmendi, quesillo Colun / Soprole, carne al vacío Líder.',
      'Jumbo': 'Marca Cuisine & Co (quinoa, avena, atún lomos, semillas de chía), salmón del sur fresco envasado, vacuno postas magras, huevos de gallina libre.',
      'Santa Isabel': 'Marca Cuisine & Co y Máxima, ofertas de 2da unidad en abarrotes y pollo trozado.',
      'Unimarc': 'Marca Unimarc, carnes y verduras de la "Ruta del Ahorro", quesillo Colun.',
      'La Vega Central / Feria Libre': 'Palta Hass al kilo, porotos desgranados frescos, reineta y merluza fresca del día, verduras de estación.'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA CHILE:
- Usa SIEMPRE "Palta" o "Palta Hass" (NUNCA "aguacate").
- Usa SIEMPRE "Zapallo italiano" (NUNCA "calabacín" ni "zucchini").
- Usa SIEMPRE "Porotos verdes" (NUNCA "judías verdes" ni "ejotes").
- Usa SIEMPRE "Porotos" (tórtola, negros) (NUNCA "alubias" ni "frijoles").
- Usa SIEMPRE "Frutillas" (NUNCA "fresas").
- Usa SIEMPRE "Quesillo" (NUNCA "requesón" ni "queso de burgos").
- Usa SIEMPRE cortes de vacuno chilenos: "Posta negra", "Posta rosada", "Lomo liso", "Carne molida tártaro" (NUNCA "ternera").
- Usa SIEMPRE "Pimentón" (NUNCA "pimiento").
- Usa SIEMPRE "Choclo" (NUNCA "maíz" o "elote").
- Usa SIEMPRE "Zapallo camote" o "Zapallo" para cremas y sopas.`
  },
  PE: {
    regionCode: 'PE',
    regionName: 'Perú',
    terms: {
      avocado: 'Palta (Fuerte o Hass)',
      sweetPotato: 'Camote (amarillo o morado)',
      zucchini: 'Zapallito italiano',
      greenBeans: 'Vainitas',
      beans: 'Frejoles (canario, panamito, negro, caballero) y Pallares',
      banana: 'Plátano (de seda, isla, bellaco o bizcochito)',
      strawberry: 'Fresas',
      freshCheese: 'Queso fresco pasteurizado / Ricotta',
      beef: 'Carne de res (bistec de lomo, churrasco, pulpa de pierna, molida especial)',
      peppers: 'Pimiento morrón / Ají amarillo sin venas / Ají panca',
      corn: 'Choclo desgranado / Maíz morado',
      cream: 'Crema de leche',
      butter: 'Mantequilla',
      shrimp: 'Langostinos / Camarones',
      potatoes: 'Papa amarilla / Papa canchán / Papa huamantanga',
      bread: 'Pan integral de granos / Quinua / Tostadas de arroz'
    },
    supermarketInventoryHighlights: {
      'Plaza Vea': 'Marca Bell\'s (avena hojuelas Bell\'s, atún Bell\'s en agua, arroz, fideos, quinua), pollo fresco San Fernando o Redondos, huevos La Calera.',
      'Metro': 'Marca Metro y Cuisine & Co, pollo fresco, verduras envasadas y a granel, filetes de pescado fresco.',
      'Tottus': 'Marca Tottus y Precio Uno (avena, atún, menestras en bolsa), carnes nacionales en bandeja, queso fresco.',
      'Wong': 'Marca Cuisine & Co / Wong selección, pescadería fresca del litoral peruano (corvina, bonito, lenguado, salmón), quinua perlada orgánica.',
      'Mercado de Abastos / Mayorista': 'Papa amarilla y nativa al peso, ají amarillo fresco, pescado bonito y jurel frescos y económicos, menestras a granel.'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA PERÚ:
- Usa SIEMPRE "Palta" (Fuerte o Hass) (NUNCA "aguacate").
- Usa SIEMPRE "Camote" (amarillo o morado) (NUNCA "boniato" ni "batata").
- Usa SIEMPRE "Zapallito italiano" (NUNCA "calabacín").
- Usa SIEMPRE "Vainitas" (NUNCA "judías verdes" ni "chauchas").
- Usa SIEMPRE "Frejoles" (canario, panamito) o "Menestras" (NUNCA "alubias").
- Usa SIEMPRE "Plátano de seda" o "Plátano isla" (NUNCA solo "plátano" genérico).
- Usa SIEMPRE "Queso fresco" o "Ricotta" (NUNCA "requesón" ni "queso feta").
- Usa SIEMPRE "Carne de res", "Bistec de lomo", "Pechuga de pollo San Fernando", "Pescado bonito/jurel" (NUNCA "ternera").
- Incorpora "Ají amarillo", "Papa amarilla / canchán", "Choclo desgranado" y "Quinua perlada".`
  },
  ES: {
    regionCode: 'ES',
    regionName: 'España',
    terms: {
      avocado: 'Aguacate',
      sweetPotato: 'Boniato / Batata',
      zucchini: 'Calabacín',
      greenBeans: 'Judías verdes',
      beans: 'Alubias blancas / Garbanzos / Lentejas pardinas',
      banana: 'Plátano de Canarias',
      strawberry: 'Fresas de Huelva',
      freshCheese: 'Queso fresco batido 0% / Requesón / Queso de Burgos',
      beef: 'Ternera magra (filete de ternera, carne picada magra ≥90%)',
      peppers: 'Pimiento (rojo, verde, italiano)',
      corn: 'Maíz dulce en lata',
      cream: 'Nata ligera para cocinar',
      butter: 'Mantequilla',
      shrimp: 'Gambas / Langostinos cocidos o crudos',
      potatoes: 'Patatas (nuevas o para cocer)',
      bread: 'Pan 100% integral de masa madre o centeno / Copos de avena'
    },
    supermarketInventoryHighlights: {
      'Mercadona': 'Marca Hacendado (copos de avena, queso fresco batido 0%, claras pasteurizadas, atún claro al natural, hummus clásico, quinoa, salmón al natural, pan 100% integral de centeno), pechuga de pollo fileteada en bandeja, lomos de merluza congelados Hacendado.',
      'Carrefour': 'Marcas Carrefour Classic y Carrefour BIO (legumbres bio en tarro, avena bio, queso fresco, kéfir), carnicería y pescadería fresca en bandeja.',
      'Lidl': 'Marca Milbona (yogur griego, queso fresco batido, skyr de proteínas), marca Freshona (verduras y frutos rojos congelados), frutos secos Alesto.',
      'Día': 'Marca Día (avena, huevos camperos clase L, atún claro, legumbres en tarro, pechuga de pavo).',
      'Alcampo': 'Marca Auchan / Auchan Selección (legumbres a granel, carnes magras al corte, merluza y salmón fresco).'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA ESPAÑA:
- Usa "Aguacate", "Boniato", "Calabacín", "Judías verdes", "Alubias blancas / Garbanzos / Lentejas".
- Usa "Plátano de Canarias", "Fresas de Huelva", "Queso fresco batido 0%", "Requesón".
- Usa "Pechuga de pollo / Pavo", "Ternera magra", "Lomos de salmón / Merluza fresca".
- Usa "Patatas", "Pimientos rojos y verdes", "Aceite de oliva virgen extra (AOVE)".`
  },
  US: {
    regionCode: 'US',
    regionName: 'Estados Unidos / Internacional',
    terms: {
      avocado: 'Aguacate Hass / Hass Avocado',
      sweetPotato: 'Camote / Sweet Potato',
      zucchini: 'Calabacín / Zucchini',
      greenBeans: 'Ejotes / Green Beans',
      beans: 'Frijoles negros / Black Beans / Pinto Beans',
      banana: 'Plátano / Banana',
      strawberry: 'Fresas / Strawberries',
      freshCheese: 'Queso cottage bajo en grasa / Greek Yogurt / Requesón',
      beef: 'Carne molida magra (Lean Ground Beef 90/10) / Bistec de res (Sirloin Steak)',
      peppers: 'Pimientos morrón / Bell Peppers',
      corn: 'Elote dulce / Sweet Corn',
      cream: 'Heavy Cream / Media Crema',
      butter: 'Mantequilla sin sal / Unsalted Butter',
      shrimp: 'Camarones / Shrimp',
      potatoes: 'Papas Russet / Red Potatoes',
      bread: 'Pan 100% integral (100% Whole Wheat Bread) / Tortillas de maíz'
    },
    supermarketInventoryHighlights: {
      'Walmart': 'Great Value Brand (Rolled Oats, Canned Tuna in Water, Black Beans, Frozen Vegetables), Large Eggs 18-30ct, Fresh Chicken Breast, Low Fat Cottage Cheese.',
      'Target Grocery': 'Good & Gather Brand (Organic Quinoa, Greek Yogurt, Rolled Oats, Salmon fillets, Extra Virgin Olive Oil).',
      'Costco': 'Kirkland Signature (Chicken Breast 6-pack, Wild Caught Salmon, Egg Whites, Organic Peanut Butter, Mixed Nuts).',
      'Trader Joe\'s': 'Trader Joe\'s Organic Rolled Oats, Guacamole to go, Wild Salmon, Greek non-fat yogurt, Seasoning Blends.',
      'Whole Foods': '365 by Whole Foods Market (Organic Tofu, Grass-fed Ground Beef, Organic Rolled Oats, Atlantic Salmon).'
    },
    rulesPromptSnippet: `
VOCABULARIO OBLIGATORIO DE INGREDIENTES PARA ESTADOS UNIDOS / INTERNACIONAL:
- Usa nombres claros y bilingües o familiares para compras en EE.UU. (ej: "Pechuga de pollo / Chicken Breast", "Avena integral / Rolled Oats", "Aguacate Hass / Hass Avocado", "Frijoles negros / Black Beans", "Salmón salvaje / Wild Salmon", "Huevos grandes / Large Eggs").`
  }
};

export function getRegionalIngredientProfile(
  countryNameOrCurrency?: string,
  supermarketName?: string,
  currency?: string
): RegionalIngredientProfile {
  const combined = `${countryNameOrCurrency || ''} ${supermarketName || ''} ${currency || ''}`.toLowerCase().trim();
  
  if (
    combined.includes('arg') || 
    combined.includes('ars') || 
    combined.includes('coto') || 
    combined.includes('vea') || 
    combined.includes('disco') ||
    combined.includes('ciudad del lago')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.AR;
  }

  if (
    combined.includes('mex') || 
    combined.includes('mxn') || 
    combined.includes('aurrera') || 
    combined.includes('chedraui') || 
    combined.includes('soriana') || 
    combined.includes('fresko') || 
    combined.includes('tianguis') ||
    combined.includes('precíssimo') ||
    combined.includes('la comer')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.MX;
  }

  if (
    combined.includes('col') || 
    combined.includes('cop') || 
    combined.includes('éxito') || 
    combined.includes('exito') || 
    combined.includes('d1') || 
    combined.includes('ara') || 
    combined.includes('carulla') || 
    combined.includes('paloquemao') ||
    combined.includes('ekono') ||
    combined.includes('latti')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.CO;
  }

  if (
    combined.includes('chl') || 
    combined.includes('clp') || 
    combined.includes('chile') || 
    combined.includes('lider') || 
    combined.includes('líder') || 
    combined.includes('unimarc') || 
    combined.includes('santa isabel') || 
    combined.includes('feria libre') ||
    combined.includes('nuestra tierra')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.CL;
  }

  if (
    combined.includes('per') || 
    combined.includes('pen') || 
    combined.includes('s/.') || 
    combined.includes('plaza vea') || 
    combined.includes('wong') || 
    combined.includes('vivanda') || 
    combined.includes('abastos') ||
    combined.includes('bells') ||
    combined.includes('precio uno')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.PE;
  }

  if (
    combined.includes('usa') || 
    combined.includes('eeuu') || 
    combined.includes('estados unidos') || 
    combined.includes('usd') || 
    combined.includes('trader joe') || 
    combined.includes('kroger') || 
    combined.includes('whole foods') ||
    combined.includes('target')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.US;
  }

  if (
    combined.includes('esp') || 
    combined.includes('spain') || 
    combined.includes('españa') || 
    combined.includes('eur') || 
    combined.includes('€') || 
    combined.includes('mercadona') || 
    combined.includes('alcampo') || 
    combined.includes('eroski') || 
    combined.includes('bonpreu') || 
    combined.includes('consum') || 
    combined.includes('hacendado') ||
    combined.includes('milbona') ||
    combined.includes('alipende') || 
    combined.includes('ahorramas')
  ) {
    return REGIONAL_INGREDIENT_PROFILES.ES;
  }

  // Check supermarket directly against REGIONAL_SUPERMARKETS list
  if (supermarketName) {
    const smNorm = supermarketName.toLowerCase().trim();
    for (const country of REGIONAL_SUPERMARKETS) {
      if (country.supermarkets.some(s => s.name.toLowerCase() === smNorm || smNorm.includes(s.name.toLowerCase()))) {
        const cCode = country.countryCode;
        if (REGIONAL_INGREDIENT_PROFILES[cCode]) return REGIONAL_INGREDIENT_PROFILES[cCode];
      }
    }
  }

  return REGIONAL_INGREDIENT_PROFILES.ES;
}

