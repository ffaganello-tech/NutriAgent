import React, { useState } from 'react';
import { WeeklyMenuPlan, ShoppingCategory, ShoppingItem } from '../types';
import { 
  ShoppingBag, 
  Check, 
  Copy, 
  FileDown, 
  Plus, 
  Trash2, 
  Store, 
  Tag, 
  Sparkles,
  CheckCircle2,
  Euro,
  Share2
} from 'lucide-react';
import { exportMenuToPDF, copyShoppingListToClipboard } from '../utils/pdfExport';

interface ShoppingListViewerProps {
  plan: WeeklyMenuPlan;
  onUpdateShoppingList: (newCategories: ShoppingCategory[]) => void;
  onBackToMenu: () => void;
}

export const ShoppingListViewer: React.FC<ShoppingListViewerProps> = ({
  plan,
  onUpdateShoppingList,
  onBackToMenu,
}) => {
  const [categories, setCategories] = useState<ShoppingCategory[]>(plan.shoppingList);
  const [copied, setCopied] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [selectedCatName, setSelectedCatName] = useState<string>(
    plan.shoppingList[0]?.name || 'Frutas y Verduras'
  );

  const totalItemsCount = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItemsCount = categories.reduce(
    (acc, cat) => acc + cat.items.filter(i => i.checked).length, 
    0
  );
  const progressPct = totalItemsCount > 0 ? Math.round((checkedItemsCount / totalItemsCount) * 100) : 0;

  const handleToggleItem = (catIdx: number, itemIdx: number) => {
    const updated = [...categories];
    const item = updated[catIdx].items[itemIdx];
    item.checked = !item.checked;
    setCategories(updated);
    onUpdateShoppingList(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingItem = {
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      quantity: newItemQty.trim() || '1 unidad',
      estimatedPrice: 1.5,
      category: selectedCatName,
      checked: false,
      notes: 'Añadido manualmente'
    };

    const updated = categories.map(cat => {
      if (cat.name === selectedCatName) {
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    });

    setCategories(updated);
    onUpdateShoppingList(updated);
    setNewItemName('');
    setNewItemQty('');
  };

  const handleDeleteItem = (catIdx: number, itemIdx: number) => {
    const updated = [...categories];
    updated[catIdx].items.splice(itemIdx, 1);
    setCategories(updated);
    onUpdateShoppingList(updated);
  };

  const handleCopy = () => {
    const success = copyShoppingListToClipboard({
      ...plan,
      shoppingList: categories,
    });
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExportPDF = () => {
    exportMenuToPDF({
      ...plan,
      shoppingList: categories,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Top Banner with Progress & Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                {plan.inputConfig.supermarket}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                plan.costEstimate.isEcommercePricing !== false
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {plan.costEstimate.isEcommercePricing !== false 
                  ? '🛒 Precios Catálogo E-Commerce' 
                  : '🏪 Estimación Comercio de Barrio'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {plan.days.length} Días · {plan.inputConfig.servings} Personas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Lista de la Compra Consolidada
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Ingredientes agrupados por pasillo de supermercado para hacer la compra rápida y sin olvidos.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportPDF}
              id="btn-shopping-export-pdf"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>

            <button
              onClick={handleCopy}
              id="btn-shopping-copy-clipboard"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Copiada!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-300" />
                  <span>Copiar Lista</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar & Cost estimation */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-900">
                Progreso del Carrito: {checkedItemsCount} de {totalItemsCount} comprados ({progressPct}%)
              </span>
            </div>
            <span className="font-bold text-slate-700">
              Total aprox: ~{plan.costEstimate.totalEstimatedCost} {plan.costEstimate.currency}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Añadir producto extra (ej: Aceite, Café, Papel...)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Cantidad (ej: 1 pack, 500g)"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            className="sm:w-40 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={selectedCatName}
            onChange={(e) => setSelectedCatName(e.target.value)}
            className="sm:w-48 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
          >
            {categories.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </form>

      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((category, catIdx) => {
          const catTotalChecked = category.items.filter(i => i.checked).length;

          return (
            <div
              key={category.name}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="font-bold text-sm text-slate-900 font-serif">
                    {category.name}
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {catTotalChecked} / {category.items.length}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={item.id || itemIdx}
                    onClick={() => handleToggleItem(catIdx, itemIdx)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      item.checked
                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-100 hover:border-emerald-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        item.checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-medium block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {item.quantity} {item.notes ? `· ${item.notes}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.estimatedPrice > 0 && (
                        <span className="text-xs font-semibold text-slate-500">
                          ~{item.estimatedPrice >= 100 
                            ? Math.round(item.estimatedPrice).toLocaleString('es-ES') 
                            : item.estimatedPrice.toFixed(2)} {plan.costEstimate.currency}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(catIdx, itemIdx);
                        }}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {category.items.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-2 text-center">
                    No hay productos en esta categoría.
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
