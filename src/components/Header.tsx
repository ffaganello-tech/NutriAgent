import React from 'react';
import { ChefHat, Sparkles, FileText, Dumbbell, ShoppingBag, Baby } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'menu' | 'shopping' | 'cost';
  setActiveTab: (tab: 'generator' | 'menu' | 'shopping' | 'cost') => void;
  hasPlan: boolean;
  onOpenDocModal: () => void;
  isFitMode: boolean;
  isPediatricMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasPlan,
  onOpenDocModal,
  isFitMode,
  isPediatricMode,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  Nutriagente Semanal
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                  Nutri Chef IA
                </span>
                {isFitMode && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                    <Dumbbell className="w-3 h-3 mr-1 text-amber-700" />
                    Modo Fit
                  </span>
                )}
                {isPediatricMode && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-200">
                    <Baby className="w-3 h-3 mr-1 text-sky-700" />
                    Pediátrico Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Menús semanales inteligentes, nutrición clínica pediátrica e ingredientes por supermercado
              </p>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenDocModal}
              id="header-doc-upload-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors"
              title="Cargar plan o dieta de nutricionista / médico"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Cargar Dieta Médica</span>
              <span className="md:hidden">Dieta Doc</span>
            </button>

            {hasPlan && (
              <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
                <button
                  id="tab-btn-menu"
                  onClick={() => setActiveTab('menu')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'menu'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Menú Semanal
                </button>
                <button
                  id="tab-btn-shopping"
                  onClick={() => setActiveTab('shopping')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === 'shopping'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Lista Compra
                </button>
                <button
                  id="tab-btn-generator"
                  onClick={() => setActiveTab('generator')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'generator'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ajustes
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
