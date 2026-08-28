import React, { useState } from 'react';
import { X, Calculator, Flame, Dumbbell, Activity, Check } from 'lucide-react';

interface FitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTargets: (targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal: 'perder_grasa' | 'mantener' | 'ganar_musculo';
  }) => void;
}

export const FitCalculatorModal: React.FC<FitCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyTargets,
}) => {
  const [gender, setGender] = useState<'hombre' | 'mujer'>('hombre');
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [age, setAge] = useState<number>(30);
  const [activity, setActivity] = useState<number>(1.4); // 1.2 sedentario, 1.4 moderado, 1.6 activo, 1.8 muy activo
  const [goal, setGoal] = useState<'perder_grasa' | 'mantener' | 'ganar_musculo'>('perder_grasa');

  if (!isOpen) return null;

  // Mifflin-St Jeor formula
  const bmr = gender === 'hombre'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  let targetCal = tdee;
  if (goal === 'perder_grasa') {
    targetCal = Math.round(tdee * 0.82); // 18% deficit
  } else if (goal === 'ganar_musculo') {
    targetCal = Math.round(tdee * 1.12); // 12% surplus
  }

  // Protein: 2.0g/kg for loss/gain, 1.8g/kg for maintenance
  const proteinG = Math.round(weightKg * (goal === 'mantener' ? 1.8 : 2.0));
  // Fats: 0.9g/kg
  const fatG = Math.round(weightKg * 0.9);
  // Carbs: rest of calories
  const remainingCal = targetCal - (proteinG * 4 + fatG * 9);
  const carbsG = Math.max(50, Math.round(remainingCal / 4));

  const handleApply = () => {
    onApplyTargets({
      calories: targetCal,
      protein: proteinG,
      carbs: carbsG,
      fat: fatG,
      goal: goal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calculator className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Calculadora Fitness & Macros</h3>
              <p className="text-xs text-emerald-100">Cálculo de TDEE y distribución por objetivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Sexo */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Sexo Biológico
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('hombre')}
                className={`py-2 px-4 rounded-xl text-sm font-medium border transition-all ${
                  gender === 'hombre'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Hombre
              </button>
              <button
                type="button"
                onClick={() => setGender('mujer')}
                className={`py-2 px-4 rounded-xl text-sm font-medium border transition-all ${
                  gender === 'mujer'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mujer
              </button>
            </div>
          </div>

          {/* Peso, Altura, Edad */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Peso (kg)</label>
              <input
                type="number"
                min="40"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Altura (cm)</label>
              <input
                type="number"
                min="130"
                max="220"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Edad</label>
              <input
                type="number"
                min="14"
                max="99"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Actividad Física */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Nivel de Actividad Semanal
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value={1.2}>Sedentario (Trabajo de oficina, poco ejercicio)</option>
              <option value={1.375}>Ligero (Entreno o caminata 1-3 días/semana)</option>
              <option value={1.55}>Moderado (Entreno de fuerza o cardio 3-5 días/semana)</option>
              <option value={1.725}>Intenso (Entreno duro 6-7 días/semana)</option>
              <option value={1.9}>Atleta / Trabajo físico muy pesado</option>
            </select>
          </div>

          {/* Objetivo Fitness */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Objetivo Principal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal('perder_grasa')}
                className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  goal === 'perder_grasa'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Perder Grasa</span>
              </button>

              <button
                type="button"
                onClick={() => setGoal('mantener')}
                className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  goal === 'mantener'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-1 ring-amber-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-500" />
                <span>Mantener Peso</span>
              </button>

              <button
                type="button"
                onClick={() => setGoal('ganar_musculo')}
                className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  goal === 'ganar_musculo'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-emerald-600" />
                <span>Ganar Músculo</span>
              </button>
            </div>
          </div>

          {/* Resultado Calculado */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Calorías Diarias Objetivo</span>
                <div className="text-2xl font-extrabold text-slate-900 font-serif">
                  {targetCal} <span className="text-sm font-normal text-slate-500">kcal/día</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {goal === 'perder_grasa' ? 'Déficit calórico' : goal === 'ganar_musculo' ? 'Superávit limpio' : 'Normocalórico'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[11px] text-blue-600 font-semibold block">Proteína</span>
                <span className="text-base font-bold text-slate-800">{proteinG}g</span>
                <span className="text-[10px] text-slate-400 block">{Math.round((proteinG * 4 / targetCal) * 100)}%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[11px] text-amber-600 font-semibold block">Carbos</span>
                <span className="text-base font-bold text-slate-800">{carbsG}g</span>
                <span className="text-[10px] text-slate-400 block">{Math.round((carbsG * 4 / targetCal) * 100)}%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[11px] text-emerald-600 font-semibold block">Grasas</span>
                <span className="text-base font-bold text-slate-800">{fatG}g</span>
                <span className="text-[10px] text-slate-400 block">{Math.round((fatG * 9 / targetCal) * 100)}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Aplicar al Planificador
          </button>
        </div>

      </div>
    </div>
  );
};
