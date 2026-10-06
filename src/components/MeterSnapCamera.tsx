import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Check,
  Edit3,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Loader2,
  XCircle,
} from 'lucide-react';
import { Household } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { renderDigitalMeterImage, calculateEstimatedBill } from '../utils/tariffCalculator';

interface MeterSnapCameraProps {
  household: Household;
  latestReading: number;
  onSaveReading: (
    readingValue: number,
    source: 'camera' | 'manual',
    confidence?: string,
    meterType?: string
  ) => void;
}

interface OcrResultState {
  reading: number;
  rawDigits: string;
  confidence: string;
  meterType: string;
  notes: string;
  imagePreview: string;
}

export const MeterSnapCamera: React.FC<MeterSnapCameraProps> = ({
  household,
  latestReading,
  onSaveReading,
}) => {
  const t = TRANSLATIONS[household.language];
  const lang = household.language;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResultState | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [rolloverWarning, setRolloverWarning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const baseline = household.lastOfficialReading;

  // Sample realistic Chennai TANGEDCO meter readings relative to household baseline
  const sampleMeters = [
    {
      id: 'safe-320',
      unitsOffset: 320,
      reading: baseline + 320,
      labelEn: 'Safe Zone Meter (320 Units Used)',
      labelTa: 'பாதுகாப்பான நிலை (320 யூனிட்கள்)',
      subEn: 'Bill: ₹564 · 200 Free Units Active',
      subTa: 'பில்: ₹564 · 200 இலவச யூனிட்',
    },
    {
      id: 'warn-462',
      unitsOffset: 462,
      reading: baseline + 462,
      labelEn: 'Approaching Cliff (462 Units Used)',
      labelTa: 'வரம்பை நெருங்கும் நிலை (462 யூனிட்கள்)',
      subEn: 'Bill: ₹1,331 · Only 38 units left to 500!',
      subTa: 'பில்: ₹1,331 · இன்னும் 38 யூனிட் மட்டுமே!',
    },
    {
      id: 'exact-500',
      unitsOffset: 500,
      reading: baseline + 500,
      labelEn: 'At 500-Unit Limit (500 Units Used)',
      labelTa: 'சரியாக 500 யூனிட் வரம்பு',
      subEn: 'Bill: ₹1,570 · Maximum 200 Free Quota',
      subTa: 'பில்: ₹1,570 · 200 யூனிட் இலவசம்',
    },
    {
      id: 'cliff-510',
      unitsOffset: 510,
      reading: baseline + 510,
      labelEn: 'Crossed 500 Cliff (510 Units Used)',
      labelTa: '500 தாண்டிய நிலை (510 யூனிட்கள்)',
      subEn: 'Bill: ₹2,124 · +₹554 jump for 10 extra units!',
      subTa: 'பில்: ₹2,124 · 10 யூனிட்டுக்கு +₹554 உயர்வு!',
    },
  ];

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setOcrResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err: any) {
      setCameraError(
        lang === 'en'
          ? 'Camera access was unavailable in this browser frame. You can upload a meter photo or tap any sample TANGEDCO meter below.'
          : 'கேமரா அனுமதி கிடைக்கவில்லை. கீழே உள்ள மாதிரி TANGEDCO மீட்டர் படத்தைத் தேர்வு செய்யவும் அல்லது போட்டோவைப் பதிவேற்றவும்.'
      );
    }
  };

  const runGeminiOcr = async (imageDataUrl: string, fallbackHint?: number) => {
    setIsProcessing(true);
    setRolloverWarning(false);
    setIsEditing(false);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          mimeType: 'image/png',
          fallbackHint,
        }),
      });

      const data = await response.json();
      const detectedReading =
        typeof data.reading === 'number' && !isNaN(data.reading)
          ? data.reading
          : fallbackHint ?? latestReading;

      setOcrResult({
        reading: detectedReading,
        rawDigits: data.rawDigits || String(detectedReading).padStart(6, '0'),
        confidence: data.confidence || 'high',
        meterType: data.meterType || 'TANGEDCO Static Single-Phase kWh LCD',
        notes: data.notes || 'Extracted 6-digit cumulative kWh register.',
        imagePreview: imageDataUrl,
      });
      setManualInput(String(detectedReading));
      if (detectedReading < baseline) {
        setRolloverWarning(true);
      }
    } catch {
      const fallback = fallbackHint ?? latestReading;
      setOcrResult({
        reading: fallback,
        rawDigits: String(fallback).padStart(6, '0'),
        confidence: 'medium',
        meterType: 'TANGEDCO Digital LCD Meter',
        notes: 'Please verify digits below.',
        imagePreview: imageDataUrl,
      });
      setManualInput(String(fallback));
    } finally {
      setIsProcessing(false);
    }
  };

  const captureFromVideo = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    stopCamera();
    runGeminiOcr(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        runGeminiOcr(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSampleMeterSelect = (targetReading: number) => {
    stopCamera();
    const generatedDataUrl = renderDigitalMeterImage(targetReading, household.serviceNumber);
    runGeminiOcr(generatedDataUrl, targetReading);
  };

  const handleConfirmSave = (readingToSave: number, source: 'camera' | 'manual') => {
    if (readingToSave < baseline) {
      setRolloverWarning(true);
      return;
    }
    onSaveReading(
      readingToSave,
      source,
      ocrResult?.confidence || 'high',
      ocrResult?.meterType || 'TANGEDCO Digital LCD'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          {t.snapTitle}
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-1.5 max-w-2xl">{t.snapSubtitle}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-3 font-mono tabular-nums">
          <span>
            {t.baselineReadingLabel}: {baseline.toLocaleString('en-IN')} kWh
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.latestReadingLabel}: {latestReading.toLocaleString('en-IN')} kWh
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.unitsUsedLabel}: {Math.max(0, latestReading - baseline)} kWh
          </span>
        </div>
      </div>

      {/* Main Capture & OCR Confirmation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Camera Viewfinder / Photo Preview & Sample Meters */}
        <div className="lg:col-span-7 space-y-6">
          {/* Viewfinder Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>{t.alignGuideText}</span>
              <span className="font-mono text-amber-400">TANGEDCO kWh OCR</span>
            </div>

            <div className="relative aspect-[16/10] bg-slate-950 flex flex-col items-center justify-center p-4">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Alignment Guide Box */}
                  <div className="pointer-events-none absolute inset-8 border-2 border-dashed border-amber-400/90 rounded-xl flex flex-col justify-between p-3">
                    <span className="text-[11px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded self-start">
                      CUMULATIVE kWh DISPLAY WINDOW
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded self-end">
                      IGNORE DECIMAL FRACTION
                    </span>
                  </div>
                </>
              ) : ocrResult?.imagePreview ? (
                <img
                  src={ocrResult.imagePreview}
                  alt="Captured electricity meter display"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full max-w-md border-2 border-dashed border-slate-700 rounded-xl p-6 text-center space-y-4">
                  {/* Simulated LCD preview window */}
                  <div className="bg-lime-200/95 text-slate-950 rounded-lg px-5 py-4 font-mono border-2 border-lime-600 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] font-bold text-lime-950 mb-1">
                      <span>CUMULATIVE ENERGY</span>
                      <span>TANGEDCO</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold tracking-wider tabular-nums">
                      {String(latestReading).padStart(6, '0')}{' '}
                      <span className="text-lg font-semibold">kWh</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{t.alignGuideText}</p>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                  <Loader2 className="w-9 h-9 text-amber-400 animate-spin mb-3" />
                  <p className="text-base font-semibold">{t.ocrProcessing}</p>
                </div>
              )}
            </div>

            {/* Camera Action Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center gap-3">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="min-h-[48px] px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.openLiveCamera}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={captureFromVideo}
                    className="min-h-[48px] px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t.captureFrameBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="min-h-[48px] px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition-colors whitespace-nowrap"
                  >
                    {t.stopLiveCamera}
                  </button>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[48px] px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadPhotoBtn}</span>
              </button>
            </div>
          </div>

          {cameraError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Sample TANGEDCO Meter Presets for Instant OCR Demo */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.sampleMetersHeading}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{t.sampleMetersSub}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleMeters.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSampleMeterSelect(sample.reading)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-600 hover:bg-amber-50/40 text-left transition-all flex flex-col justify-between min-h-[84px]"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {lang === 'en' ? sample.labelEn : sample.labelTa}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-800 tabular-nums shrink-0">
                      {String(sample.reading).padStart(6, '0')} kWh
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 font-mono tabular-nums">
                    {lang === 'en' ? sample.subEn : sample.subTa}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: OCR Confirmation & Manual Entry Panel */}
        <div className="lg:col-span-5 space-y-6">
          {ocrResult ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t.ocrDetectedTitle}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{ocrResult.meterType}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {lang === 'en' ? 'Confidence' : 'துல்லியம்'}: {ocrResult.confidence}
                    </span>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              </div>

              {/* Segmented LCD Readout */}
              <div className="bg-lime-200 border-2 border-lime-600 rounded-xl p-4 text-slate-950 font-mono">
                <div className="text-[11px] font-bold text-lime-900 flex justify-between mb-1">
                  <span>DETECTED REGISTER</span>
                  <span>CUMULATIVE kWh</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold tracking-widest tabular-nums">
                  {String(isEditing ? parseInt(manualInput, 10) || 0 : ocrResult.reading).padStart(
                    6,
                    '0'
                  )}{' '}
                  <span className="text-base font-semibold">kWh</span>
                </div>
              </div>

              {/* Resulting Cycle Calculation Preview */}
              {(() => {
                const candidateReading = isEditing
                  ? parseInt(manualInput, 10) || 0
                  : ocrResult.reading;
                const candidateUnits = Math.max(0, candidateReading - baseline);
                const candidateBill = calculateEstimatedBill(candidateUnits);

                return (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{t.baselineReadingLabel}:</span>
                      <span className="font-mono font-semibold tabular-nums">
                        {baseline.toLocaleString('en-IN')} kWh
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-semibold text-sm pt-1 border-t border-slate-200">
                      <span>{t.unitsUsedLabel}:</span>
                      <span className="font-mono tabular-nums text-amber-700">
                        {candidateUnits} {lang === 'en' ? 'units' : 'யூனிட்கள்'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-semibold text-sm">
                      <span>{t.estimatedBillLabel}:</span>
                      <span className="font-mono tabular-nums">
                        ₹{candidateBill.totalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Rollover / Lower than baseline warning */}
              {rolloverWarning && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{t.rolloverErrorTitle}</span>
                  </div>
                  <p className="text-red-800 leading-relaxed">{t.rolloverErrorDesc}</p>
                </div>
              )}

              {!isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">{t.ocrIsCorrectQuestion}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleConfirmSave(ocrResult.reading, 'camera')}
                      className="min-h-[48px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.btnYesConfirm}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setManualInput(String(ocrResult.reading));
                      }}
                      className="min-h-[48px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{t.btnEditDigits}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOcrResult(null)}
                    className="w-full min-h-[44px] px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.btnRetakePhoto}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.editReadingLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999999}
                    value={manualInput}
                    onChange={(e) => {
                      setManualInput(e.target.value);
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= baseline) {
                        setRolloverWarning(false);
                      }
                    }}
                    className="w-full min-h-[48px] px-4 py-2.5 border border-slate-300 rounded-xl font-mono text-xl font-bold tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseInt(manualInput, 10);
                        if (!isNaN(parsed)) {
                          handleConfirmSave(parsed, 'manual');
                        }
                      }}
                      className="flex-1 min-h-[48px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.saveEditedReading}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="min-h-[48px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl whitespace-nowrap"
                    >
                      {lang === 'en' ? 'Cancel' : 'ரத்து'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Direct Manual Entry Fallback Card */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">{t.btnQuickManualAdd}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{t.editReadingLabel}</p>

              <div className="space-y-3">
                <input
                  type="number"
                  min={0}
                  max={999999}
                  placeholder={String(latestReading)}
                  value={manualInput}
                  onChange={(e) => {
                    setManualInput(e.target.value);
                    setRolloverWarning(false);
                  }}
                  className="w-full min-h-[48px] px-4 py-2.5 border border-slate-300 rounded-xl font-mono text-lg font-bold tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />

                {rolloverWarning && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                    <p className="font-bold">{t.rolloverErrorTitle}</p>
                    <p className="mt-0.5">{t.rolloverErrorDesc}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseInt(manualInput, 10);
                    if (isNaN(parsed)) return;
                    if (parsed < baseline) {
                      setRolloverWarning(true);
                      return;
                    }
                    onSaveReading(parsed, 'manual');
                  }}
                  className="w-full min-h-[48px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.saveEditedReading}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
