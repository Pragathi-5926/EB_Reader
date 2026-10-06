import React, { useState } from 'react';
import { Camera, Check, ChevronRight, Gauge, BellRing, ShieldCheck, X } from 'lucide-react';
import { Household, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface OnboardingWizardProps {
  household: Household;
  onComplete: (updated: Partial<Household>, latestReadingKwh?: number) => void;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  household,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<'lang' | 'slides' | 'setup'>('lang');
  const [slideIdx, setSlideIdx] = useState(0);
  const [lang, setLang] = useState<Language>(household.language);
  const [name, setName] = useState(household.name);
  const [serviceNumber, setServiceNumber] = useState(household.serviceNumber);
  const [lastReading, setLastReading] = useState(String(household.lastOfficialReading));
  const [lastDate, setLastDate] = useState(household.lastOfficialReadingDate);

  const t = TRANSLATIONS[lang];

  const slides = [
    {
      icon: Camera,
      title: t.onboardSlide1Title,
      desc: t.onboardSlide1Desc,
      stat: lang === 'en' ? '5-second photo OCR reading' : '5 நொடியில் கேமரா ரீடிங்',
    },
    {
      icon: Gauge,
      title: t.onboardSlide2Title,
      desc: t.onboardSlide2Desc,
      stat:
        lang === 'en'
          ? '500 units = ₹1,570  ·  510 units = ₹2,124 (+₹554 jump)'
          : '500 யூனிட் = ₹1,570  ·  510 யூனிட் = ₹2,124 (+₹554 உயர்வு)',
    },
    {
      icon: BellRing,
      title: t.onboardSlide3Title,
      desc: t.onboardSlide3Desc,
      stat:
        lang === 'en'
          ? 'Proactive alerts at 450 & 500 units'
          : '450 மற்றும் 500 யூனிட்டில் உடனடி எச்சரிக்கை',
    },
  ];

  const handleFinishSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBaseline = Math.max(0, parseInt(lastReading, 10) || 14120);
    onComplete({
      language: lang,
      name: name.trim() || (lang === 'ta' ? 'எனது வீடு' : 'Home'),
      serviceNumber: serviceNumber.trim() || '09-241-008-412',
      lastOfficialReading: parsedBaseline,
      lastOfficialReadingDate: lastDate,
      cycleStartDate: lastDate,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close setup wizard"
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <span className={step === 'lang' ? 'font-semibold text-slate-900' : ''}>
            01. {lang === 'en' ? 'Language' : 'மொழி'}
          </span>
          <span aria-hidden="true">·</span>
          <span className={step === 'slides' ? 'font-semibold text-slate-900' : ''}>
            02. {lang === 'en' ? 'How It Works' : 'செயல்படும் விதம்'}
          </span>
          <span aria-hidden="true">·</span>
          <span className={step === 'setup' ? 'font-semibold text-slate-900' : ''}>
            03. {lang === 'en' ? 'Baseline Reading' : 'கடந்த ரீடிங்'}
          </span>
        </div>

        {step === 'lang' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome to EB MeterSnap · நல்வரவு
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Choose your preferred language for meter readings, bill estimates, and 500-unit slab alerts.
              <br />
              உங்கள் வீட்டு மின் பயன்பாட்டைக் கண்காணிக்க மொழியைத் தேர்ந்தெடுக்கவும்.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`p-5 rounded-xl border text-left transition-all min-h-[88px] flex flex-col justify-between ${
                  lang === 'ta'
                    ? 'border-amber-600 bg-amber-50/60 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-bold">தமிழ் (Tamil)</span>
                  {lang === 'ta' && <Check className="w-5 h-5 text-amber-700" />}
                </div>
                <span className="text-xs text-slate-600 mt-2">
                  எளிய தமிழ் விளக்கம் மற்றும் பெரிய எழுத்து வசதி
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLang('en')}
                className={`p-5 rounded-xl border text-left transition-all min-h-[88px] flex flex-col justify-between ${
                  lang === 'en'
                    ? 'border-amber-600 bg-amber-50/60 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-bold">English</span>
                  {lang === 'en' && <Check className="w-5 h-5 text-amber-700" />}
                </div>
                <span className="text-xs text-slate-600 mt-2">
                  Clear TANGEDCO slab breakdown & usage alerts
                </span>
              </button>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setStep('slides')}
                className="min-h-[48px] px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>{t.btnNext}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'slides' && (
          <div>
            {(() => {
              const CurrentIcon = slides[slideIdx].icon;
              return (
                <div className="py-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-5">
                    <CurrentIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                    {slides[slideIdx].title}
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed mb-5">
                    {slides[slideIdx].desc}
                  </p>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 tabular-nums mb-6">
                    {slides[slideIdx].stat}
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('setup')}
                className="min-h-[44px] px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
              >
                {t.btnSkip}
              </button>

              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Slide ${idx + 1}`}
                    onClick={() => setSlideIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      slideIdx === idx ? 'w-6 bg-amber-600' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (slideIdx < slides.length - 1) {
                    setSlideIdx(slideIdx + 1);
                  } else {
                    setStep('setup');
                  }
                }}
                className="min-h-[48px] px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>{t.btnNext}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'setup' && (
          <form onSubmit={handleFinishSetup} className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {t.onboardSetupTitle}
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.labelHouseholdName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.labelServiceNumber}
              </label>
              <input
                type="text"
                value={serviceNumber}
                onChange={(e) => setServiceNumber(e.target.value)}
                placeholder="09-241-008-412"
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.labelBaselineReading}
                </label>
                <input
                  type="number"
                  min={0}
                  max={999999}
                  value={lastReading}
                  onChange={(e) => setLastReading(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-300 rounded-xl font-mono tabular-nums text-slate-900 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.labelBaselineDate}
                </label>
                <input
                  type="date"
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.onboardCameraNote}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep('slides')}
                className="min-h-[44px] px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {lang === 'en' ? 'Back' : 'பின்செல்'}
              </button>

              <button
                type="submit"
                className="min-h-[48px] px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Check className="w-4 h-4" />
                <span>{t.btnGetStarted}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
