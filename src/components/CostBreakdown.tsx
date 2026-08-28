import React from 'react';
import { WeeklyMenuPlan } from '../types';
import { 
  PiggyBank, 
  Store, 
  TrendingDown, 
  Lightbulb, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { REGIONAL_SUPERMARKETS, getSupermarketTierIndicator } from '../data/supermarkets';

interface CostBreakdownProps {
  plan: WeeklyMenuPlan;
  onBack: () => void;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  plan,
  onBack,
}) => {
  const { costEstimate, inputConfig } = plan;

  // Find supermarket meta if available
  const matchedSupermarket = React.useMemo(() => {
    for (const c of REGIONAL_SUPERMARKETS) {
      const found = c.supermarkets.find(s => s.name.toLowerCase() === inputConfig.supermarket.toLowerCase());
      if (found) return found;
    }
    return null;
  }, [inputConfig.supermarket]);

  const formatPrice = (val: number) => {
    if (val >= 100) {
      return Math.round(val).toLocaleString('es-ES');
    }
    return val.toFixed(2);
  };

  const isEcommerce = costEstimate.isEcommercePricing ?? matchedSupermarket?.isEcommerce ?? true;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Menú Semanal</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                {inputConfig.supermarket}
              </span>
              {matchedSupermarket && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {getSupermarketTierIndicator(matchedSupermarket, costEstimate.currency)}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isEcommerce 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {isEcommerce ? '🛒 Precios Catálogo E-Commerce' : '🏪 Mercado Tradicional de Barrio'}
              </span>
              <span className="text-xs text-slate-500">
                {plan.days.length} Días · {inputConfig.servings} Personas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Estimación de Costos y Consejos de Ahorro
            </h1>
          </div>

          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-right sm:text-right shrink-0">
            <span className="text-xs text-emerald-800 font-medium block">Total Estimado Cesta</span>
            <div className="text-3xl font-extrabold text-emerald-950 font-serif">
              {formatPrice(costEstimate.totalEstimatedCost)} <span className="text-lg">{costEstimate.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Costo por persona / semana</span>
          <span className="text-2xl font-bold text-slate-900 font-serif">
            {formatPrice(costEstimate.costPerPerson)} {costEstimate.currency}
          </span>
          <p className="text-[11px] text-slate-400">
            Calculado para {inputConfig.servings} comensales
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Costo medio por día</span>
          <span className="text-2xl font-bold text-slate-900 font-serif">
            {formatPrice(costEstimate.costPerDay)} {costEstimate.currency}
          </span>
          <p className="text-[11px] text-slate-400">
            Todas las comidas del día incluidas
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <TrendingDown className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Ahorro estimado vs delivery</span>
          <span className="text-2xl font-bold text-emerald-700 font-serif">
            ~{formatPrice(costEstimate.totalEstimatedCost * 2.5)} {costEstimate.currency}
          </span>
          <p className="text-[11px] text-slate-400">
            Cocinando en casa con recetas planificadas
          </p>
        </div>

      </div>

      {/* Supermarket Specific Advice */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
              Estrategia de compra adaptada a {inputConfig.supermarket}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isEcommerce 
              ? `Precios sincronizados con catálogo e-commerce y promociones de ${inputConfig.supermarket}.`
              : `Estimaciones optimizadas para compra en locales de barrio, fruterías y a granel.`}
          </p>
        </div>

        {matchedSupermarket?.brandName && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Línea de marca propia recomendada:</span> {matchedSupermarket.brandName}. Los productos básicos (avena, arroz, legumbres, huevos) ofrecen el mejor ratio calidad-precio.
            </div>
          </div>
        )}

        {costEstimate.savingsAdvice && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Consejo Clave del Chef & Nutricionista
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                {costEstimate.savingsAdvice}
              </p>
            </div>
          </div>
        )}

        {costEstimate.supermarketTips?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Consejos específicos para comprar en {inputConfig.supermarket}:
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {costEstimate.supermarketTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
