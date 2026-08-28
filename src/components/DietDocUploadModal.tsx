import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, Stethoscope, ArrowRight } from 'lucide-react';
import { NutritionDocAnalysis } from '../types';

interface DietDocUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDocAnalysis: (analysis: NutritionDocAnalysis, rawText: string, fileName: string) => void;
}

export const DietDocUploadModal: React.FC<DietDocUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyDocAnalysis,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionDocAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setErrorMsg(null);
    setAnalysisResult(null);

    // If text file, read directly
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTextInput(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !textInput.trim()) {
      setErrorMsg('Por favor adjunta un archivo (PDF, Imagen o Texto) o escribe/pega las pautas de tu dieta.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      let base64File = '';
      let fileType = '';

      if (selectedFile) {
        fileType = selectedFile.type || 'application/octet-stream';
        const buffer = await selectedFile.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64File = btoa(binary);
      }

      const res = await fetch('/api/analyze-diet-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: textInput,
          base64File: base64File,
          fileType: fileType,
          fileName: selectedFile?.name || 'Dieta_Nutricionista.txt',
        }),
      });

      if (!res.ok) {
        throw new Error('Error al procesar el documento');
      }

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Ocurrió un error analizando la dieta. Por favor verifica el formato o pega el texto directamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!analysisResult) return;
    const rawContent = textInput || `Documento: ${selectedFile?.name}\n${analysisResult.summary}\nRecomendaciones:\n${analysisResult.keyRecommendations.join('\n')}`;
    onApplyDocAnalysis(analysisResult, rawContent, selectedFile?.name || 'Plan de Nutricionista');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Stethoscope className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-serif">
                Cargar Dieta Médica o Nutricional
              </h3>
              <p className="text-xs text-emerald-100">
                Sube tu pauta personalizada para que la IA la incorpore con total fidelidad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {!analysisResult ? (
            <>
              {/* Drag and drop upload */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    {selectedFile ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>

                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB · Clic para cambiar archivo
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Arrastra aquí el PDF o foto de tu dieta médica
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Soporta PDF, imágenes (PNG, JPG) o documentos de texto
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Or paste text */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    O pega el texto / pautas del nutricionista
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Alimentos indicados, tomas, horarios o prohibiciones
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ejemplo: 'Dieta hipocalórica para pérdida de peso. Desayunos con avena y claras. No comer mariscos. Comidas principales con 150g de proteína magra y 60g de arroz integral. 4 comidas al día...'"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || (!selectedFile && !textInput.trim())}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analizando con IA médica...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analizar y Extraer Pautas de la Dieta</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Analysis Results preview */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Pautas extraídas con éxito
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* Detected Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Calorías</span>
                  <span className="text-base font-extrabold text-slate-900 font-serif">
                    {analysisResult.detectedCalories || 2000} kcal
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[11px] text-blue-700 block">Proteína</span>
                  <span className="text-base font-extrabold text-blue-950 font-serif">
                    {analysisResult.detectedProtein || 140}g
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[11px] text-amber-700 block">Carbos</span>
                  <span className="text-base font-extrabold text-amber-950 font-serif">
                    {analysisResult.detectedCarbs || 190}g
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[11px] text-emerald-700 block">Grasas</span>
                  <span className="text-base font-extrabold text-emerald-950 font-serif">
                    {analysisResult.detectedFat || 60}g
                  </span>
                </div>
              </div>

              {/* Exclusions detected */}
              {analysisResult.allergiesAndExclusions?.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Alimentos restringidos / Alergias detectadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.allergiesAndExclusions.map((ex, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                        ⛔ {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key recommendations */}
              {analysisResult.keyRecommendations?.length > 0 && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800 block mb-2">
                    Recomendaciones clave del profesional:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {analysisResult.keyRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Analizar otro documento
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Aplicar pautas al planificador</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
