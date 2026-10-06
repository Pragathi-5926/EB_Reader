import React, { useState, useEffect } from 'react';
import {
  Camera,
  Gauge,
  ReceiptText,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  ArrowRight,
  PlusCircle,
  X,
} from 'lucide-react';
import { Household, MeterReading, NavigationTab } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { calculateEstimatedBill } from './utils/tariffCalculator';
import { OnboardingWizard } from './components/OnboardingWizard';
import { MeterSnapCamera } from './components/MeterSnapCamera';
import { SlabExplanationView } from './components/SlabExplanationView';
import { SettingsView } from './components/SettingsView';

const STORAGE_HOUSEHOLD_KEY = 'eb_metersnap_household_v1';
const STORAGE_READINGS_KEY = 'eb_metersnap_readings_v1';

const DEFAULT_HOUSEHOLD: Household = {
  id: 'hh-chennai-01',
  name: 'Lakshmi Illam · T. Nagar',
  serviceNumber: '09-241-008-412',
  language: 'en',
  lastOfficialReading: 14120,
  lastOfficialReadingDate: '2026-08-15',
  cycleStartDate: '2026-08-15',
  largeText: false,
  alertsEnabled: true,
  weeklyReminderEnabled: true,
  onboardingCompleted: true,
};

const DEFAULT_READINGS: MeterReading[] = [
  {
    id: 'r-1',
    householdId: 'hh-chennai-01',
    readingValue: 14260,
    timestamp: '2026-08-29T09:30:00.000Z',
    source: 'camera',
    confidence: 'high',
    meterType: 'TANGEDCO Static Single-Phase kWh LCD',
  },
  {
    id: 'r-2',
    householdId: 'hh-chennai-01',
    readingValue: 14440,
    timestamp: '2026-09-14T10:15:00.000Z',
    source: 'camera',
    confidence: 'high',
    meterType: 'TANGEDCO Static Single-Phase kWh LCD',
  },
  {
    id: 'r-3',
    householdId: 'hh-chennai-01',
    readingValue: 14582, // 462 units used (in the 450-500 warning zone by default)
    timestamp: '2026-09-29T08:45:00.000Z',
    source: 'camera',
    confidence: 'high',
    meterType: 'TANGEDCO Static Single-Phase kWh LCD',
  },
];

export default function App() {
  const [household, setHousehold] = useState<Household>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HOUSEHOLD_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_HOUSEHOLD;
    } catch {
      return DEFAULT_HOUSEHOLD;
    }
  });

  const [readings, setReadings] = useState<MeterReading[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_READINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_READINGS;
    } catch {
      return DEFAULT_READINGS;
    }
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [weeklyReminderVisible, setWeeklyReminderVisible] = useState<boolean>(false);
  const [alertDismissedForReading, setAlertDismissedForReading] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HOUSEHOLD_KEY, JSON.stringify(household));
    } catch {
      // ignore storage errors
    }
  }, [household]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_READINGS_KEY, JSON.stringify(readings));
    } catch {
      // ignore storage errors
    }
  }, [readings]);

  const lang = household.language;
  const t = TRANSLATIONS[lang];

  const latestReadingObj = readings[readings.length - 1];
  const latestReadingKwh = latestReadingObj
    ? latestReadingObj.readingValue
    : household.lastOfficialReading;

  const unitsUsed = Math.max(0, latestReadingKwh - household.lastOfficialReading);
  const billEstimate = calculateEstimatedBill(unitsUsed);

  // Calculate 60-day bi-monthly cycle progress
  const daysIntoCycle = (() => {
    const start = new Date(household.lastOfficialReadingDate).getTime();
    const now = new Date('2026-09-29T12:00:00Z').getTime();
    if (isNaN(start)) return 45;
    const diff = Math.round((now - start) / (1000 * 60 * 60 * 24));
    return Math.min(60, Math.max(1, diff));
  })();

  const dailyAvg = Math.round((unitsUsed / daysIntoCycle) * 10) / 10;
  const projected60DayUnits = Math.round(dailyAvg * 60);

  const handleUpdateHousehold = (updates: Partial<Household>, newLatestKwh?: number) => {
    setHousehold((prev) => ({ ...prev, ...updates }));
    if (typeof newLatestKwh === 'number') {
      handleSaveReading(newLatestKwh, 'manual');
    }
  };

  const handleSaveReading = (
    readingValue: number,
    source: 'camera' | 'manual',
    confidence = 'high',
    meterType = 'TANGEDCO Digital LCD'
  ) => {
    const newEntry: MeterReading = {
      id: `r-${Date.now()}`,
      householdId: household.id,
      readingValue,
      timestamp: new Date().toISOString(),
      source,
      confidence,
      meterType,
    };
    setReadings((prev) => [...prev, newEntry]);
    setAlertDismissedForReading(null);
    setActiveTab('dashboard');
  };

  const applyDemoScenario = (targetUnits: number) => {
    const targetKwh = household.lastOfficialReading + targetUnits;
    const newEntry: MeterReading = {
      id: `r-demo-${Date.now()}`,
      householdId: household.id,
      readingValue: targetKwh,
      timestamp: new Date().toISOString(),
      source: 'camera',
      confidence: 'high',
      meterType: 'TANGEDCO Static Single-Phase kWh LCD',
    };
    setReadings((prev) => [...prev.slice(-4), newEntry]);
    setAlertDismissedForReading(null);
  };

  // Progress bar percentage up to 500 units
  const progressPct = Math.min(100, Math.round((unitsUsed / 500) * 100));
  const overflowUnits = Math.max(0, unitsUsed - 500);

  // Determine active usage alert banner (450-500 or >500)
  const showThresholdAlert =
    household.alertsEnabled &&
    unitsUsed >= 450 &&
    alertDismissedForReading !== latestReadingKwh;

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-12 ${
        household.largeText ? 'large-text-mode' : ''
      }`}
    >
      {/* TOP BAR CONTRACT: Strictly 1 row, 3 zones (Brand wordmark | 5 Nav Links | 2 Actions) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap focus:outline-none"
          >
            {t.appName}
          </button>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {(
              [
                { id: 'dashboard', label: t.navDashboard },
                { id: 'snap', label: t.navSnap },
                { id: 'bill', label: t.navBill },
                { id: 'slabs', label: t.navSlabs },
                { id: 'settings', label: t.navSettings },
              ] as { id: NavigationTab; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-1 transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === item.id
                    ? 'border-amber-600 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 2 Primary Actions (Language switch + Take Meter Photo CTA) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                handleUpdateHousehold({ language: household.language === 'en' ? 'ta' : 'en' })
              }
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.langSwitchLabel}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('snap')}
              className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.btnTakePhoto}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT VIEWPORT (1440px desktop baseline container) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Proactive Usage Threshold Alert Banner (>=450 or >500 units) */}
        {showThresholdAlert && (
          <div
            role="alert"
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              unitsUsed > 500
                ? 'bg-red-50 border-red-200 text-red-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  unitsUsed > 500 ? 'text-red-600' : 'text-amber-600'
                }`}
              />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                {unitsUsed > 500
                  ? t.alertsBannerCrossed500
                      .replace('{units}', String(unitsUsed))
                      .replace('{extra}', String(billEstimate.extraCostFromCliff))
                  : t.alertsBannerNear450
                      .replace('{units}', String(unitsUsed))
                      .replace('{remaining}', String(500 - unitsUsed))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('slabs')}
                className="min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-xs font-semibold rounded-lg whitespace-nowrap"
              >
                {t.btnWhyBillJumps}
              </button>
              <button
                type="button"
                aria-label="Dismiss alert"
                onClick={() => setAlertDismissedForReading(latestReadingKwh)}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Weekly Photo Reminder Alert Banner */}
        {weeklyReminderVisible && (
          <div
            role="alert"
            className="p-4 rounded-2xl border border-sky-200 bg-sky-50 text-sky-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <BellRing className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium">{t.weeklyReminderBanner}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setWeeklyReminderVisible(false);
                  setActiveTab('snap');
                }}
                className="min-h-[38px] px-3 py-1.5 bg-sky-700 text-white text-xs font-semibold rounded-lg whitespace-nowrap"
              >
                {t.btnTakePhoto}
              </button>
              <button
                type="button"
                aria-label="Dismiss weekly reminder"
                onClick={() => setWeeklyReminderVisible(false)}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center text-sky-700 hover:text-sky-950 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Sub-header with Household Metadata & Interactive Scenario Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {t.currentCycleHeading}
                </h1>
                {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5 font-mono tabular-nums">
                  <span>{household.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>TANGEDCO #{household.serviceNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t.baselineReadingLabel}: {household.lastOfficialReading.toLocaleString('en-IN')}{' '}
                    kWh ({household.lastOfficialReadingDate})
                  </span>
                </div>
              </div>

              {/* Interactive Filter / State Controls (Real <button> elements) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500 mr-1">
                  {t.demoScenarioLabel}
                </span>
                <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => applyDemoScenario(320)}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      unitsUsed === 320
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.scenarioSafe}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDemoScenario(462)}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      unitsUsed === 462
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.scenarioWarning}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDemoScenario(510)}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      unitsUsed === 510
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.scenarioCliff}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOnboarding(true)}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-colors whitespace-nowrap"
                >
                  {t.setupWizardBtn}
                </button>
              </div>
            </div>

            {/* FOCAL ANCHOR: 500-Unit Speedometer & Bill Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left 8 Columns: Real-Time 500-Unit Consumption Speedometer */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-slate-500">{t.unitsUsedLabel}</div>
                    <div className="mt-1 flex items-baseline gap-3 font-mono tabular-nums">
                      <span
                        className={`text-4xl sm:text-5xl font-bold tracking-tight ${
                          billEstimate.zone === 'cliff'
                            ? 'text-red-600'
                            : billEstimate.zone === 'warning'
                            ? 'text-amber-600'
                            : 'text-slate-900'
                        }`}
                      >
                        {unitsUsed}
                      </span>
                      <span className="text-lg text-slate-500 font-semibold">/ 500 kWh</span>
                    </div>
                  </div>

                  {/* Semantic Status Indicator with explicit icon + text label */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {billEstimate.zone === 'safe' && (
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{t.freeUnits200}</span>
                      </span>
                    )}
                    {billEstimate.zone === 'warning' && (
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{t.freeUnits200}</span>
                      </span>
                    )}
                    {billEstimate.zone === 'cliff' && (
                      <span className="flex items-center gap-1.5 text-red-600">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{t.freeUnits100}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual 500-Unit Progress Bar with Threshold Markers */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-mono text-slate-500 tabular-nums">
                    <span>0 kWh</span>
                    <span>200 kWh (Free)</span>
                    <span className="text-amber-700 font-semibold">450 (Alert)</span>
                    <span className="text-red-600 font-bold">500 kWh (Cliff)</span>
                  </div>

                  <div className="relative h-6 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex">
                    {/* Threshold guide lines at 40% (200u) and 90% (450u) */}
                    <div
                      style={{ left: '40%' }}
                      className="absolute top-0 bottom-0 w-px bg-slate-300 z-10"
                    />
                    <div
                      style={{ left: '90%' }}
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-500/70 z-10"
                    />

                    {/* Main Progress Fill */}
                    <div
                      style={{ width: `${progressPct}%` }}
                      className={`h-full transition-transform duration-200 ${
                        billEstimate.zone === 'cliff'
                          ? 'bg-red-600'
                          : billEstimate.zone === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-mono tabular-nums">
                    <span>
                      {unitsUsed <= 500
                        ? lang === 'en'
                          ? `${500 - unitsUsed} units remaining before 500-unit slab cliff`
                          : `500 யூனிட் வரம்பிற்கு இன்னும் ${500 - unitsUsed} யூனிட்கள் உள்ளன`
                        : lang === 'en'
                        ? `Exceeded 500-unit limit by +${overflowUnits} units`
                        : `500 யூனிட் வரம்பை விட +${overflowUnits} யூனிட்கள் அதிகம்`}
                    </span>
                    <span className="font-semibold">
                      {t.latestReadingLabel}: {latestReadingKwh.toLocaleString('en-IN')} kWh
                    </span>
                  </div>
                </div>

                {/* Plain-Language Status Explanation Box */}
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    billEstimate.zone === 'cliff'
                      ? 'bg-red-50/70 border-red-200 text-red-950'
                      : billEstimate.zone === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {billEstimate.zone === 'cliff'
                      ? t.zoneCliffTitle
                      : billEstimate.zone === 'warning'
                      ? t.zoneWarningTitle
                      : t.zoneSafeTitle}
                  </div>
                  <p>
                    {billEstimate.zone === 'cliff'
                      ? t.zoneCliffDesc
                      : billEstimate.zone === 'warning'
                      ? t.zoneWarningDesc
                      : t.zoneSafeDesc}
                  </p>
                </div>

                {/* Cycle Pacing Telemetry Row */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <div className="text-slate-500">{t.daysIntoCycleLabel}</div>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                      {daysIntoCycle} / 60 {lang === 'en' ? 'days' : 'நாட்கள்'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">{t.dailyAvgLabel}</div>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                      {dailyAvg} kWh/{lang === 'en' ? 'day' : 'நாள்'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">{t.projectedUnitsLabel}</div>
                    <div
                      className={`font-mono font-bold text-sm mt-0.5 tabular-nums ${
                        projected60DayUnits > 500 ? 'text-red-600' : 'text-slate-900'
                      }`}
                    >
                      ~{projected60DayUnits} kWh
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 4 Columns: Estimated EB Bill & Primary Actions */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-slate-500">{t.estimatedBillLabel}</div>
                    <div className="mt-1 font-mono text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight tabular-nums">
                      ₹{billEstimate.totalCost.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">{t.estimatedNote}</p>
                  </div>

                  {/* Mini Breakdown Summary */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-mono tabular-nums">
                    <div className="flex justify-between text-slate-600">
                      <span>{t.freeUnitsActive}:</span>
                      <span className="font-semibold text-emerald-700">
                        {billEstimate.freeUnits} kWh (₹0)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>
                        {lang === 'en' ? 'Chargeable Units:' : 'கட்டண யூனிட்கள்:'}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {billEstimate.chargeableUnits} kWh
                      </span>
                    </div>
                    {billEstimate.isOver500 ? (
                      <div className="flex justify-between text-red-600 font-semibold pt-1 border-t border-slate-100">
                        <span>
                          {lang === 'en' ? 'Extra cost vs 500 units:' : '500-ஐத் தாண்டிய கூடுதல்:'}
                        </span>
                        <span>+₹{billEstimate.extraCostFromCliff.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                        <span>
                          {lang === 'en'
                            ? 'If you cross to 510 units:'
                            : '510 யூனிட் ஆனால் பில்:'}
                        </span>
                        <span className="text-red-600 font-semibold">₹2,124 (+₹554 jump)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('snap')}
                    className="w-full min-h-[48px] px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t.btnTakePhoto}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('bill')}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-xl flex items-center justify-between transition-colors whitespace-nowrap"
                  >
                    <span>{t.btnViewBillDetails}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('slabs')}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-xl flex items-center justify-between transition-colors whitespace-nowrap"
                  >
                    <span>{t.btnWhyBillJumps}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Meter Readings Log Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{t.readingHistoryTitle}</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('snap')}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.btnTakePhoto}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-6">{lang === 'en' ? 'Date' : 'தேதி'}</th>
                      <th className="py-3 px-4">{lang === 'en' ? 'Source' : 'முறை'}</th>
                      <th className="py-3 px-4 text-right">
                        {lang === 'en' ? 'Meter Reading (kWh)' : 'மீட்டர் ரீடிங் (kWh)'}
                      </th>
                      <th className="py-3 px-4 text-right">
                        {lang === 'en' ? 'Cycle Units Used' : 'சுழற்சி யூனிட்கள்'}
                      </th>
                      <th className="py-3 px-6 text-right">
                        {lang === 'en' ? 'Est. Bill' : 'உத்தேச பில்'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {/* Baseline Row */}
                    <tr className="bg-slate-50/60 text-slate-600">
                      <td className="py-3.5 px-6 font-mono text-xs tabular-nums">
                        {household.lastOfficialReadingDate}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {lang === 'en' ? 'Official Bill Baseline' : 'கடந்த பில் ரீடிங்'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        {household.lastOfficialReading.toLocaleString('en-IN')} kWh
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">0 kWh</td>
                      <td className="py-3.5 px-6 text-right font-mono tabular-nums">₹0</td>
                    </tr>

                    {readings.map((r) => {
                      const u = Math.max(0, r.readingValue - household.lastOfficialReading);
                      const est = calculateEstimatedBill(u);
                      const dateStr = new Date(r.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      });
                      return (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-6 font-mono text-xs text-slate-700 tabular-nums">
                            {dateStr}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            {r.source === 'camera' ? t.sourceCamera : t.sourceManual}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                            {r.readingValue.toLocaleString('en-IN')} kWh
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                            {u} kWh
                          </td>
                          <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900 tabular-nums">
                            ₹{est.totalCost.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMERA SNAP & OCR */}
        {activeTab === 'snap' && (
          <MeterSnapCamera
            household={household}
            latestReading={latestReadingKwh}
            onSaveReading={handleSaveReading}
          />
        )}

        {/* TAB 3 & 4: BILL BREAKDOWN & VISUAL SLAB CLIFF GUIDE */}
        {(activeTab === 'bill' || activeTab === 'slabs') && (
          <SlabExplanationView
            household={household}
            actualUnitsUsed={unitsUsed}
            mode={activeTab}
            onSwitchMode={(m) => setActiveTab(m)}
          />
        )}

        {/* TAB 5: SETTINGS & LANGUAGE / ACCESSIBILITY */}
        {activeTab === 'settings' && (
          <SettingsView
            household={household}
            onUpdateHousehold={handleUpdateHousehold}
            onTriggerWeeklyReminder={() => setWeeklyReminderVisible(true)}
            onOpenOnboarding={() => setShowOnboarding(true)}
          />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (< md viewport, strict 64px height within 15% sticky cap) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center h-16"
      >
        {(
          [
            { id: 'dashboard', icon: Gauge, label: t.navDashboard },
            { id: 'snap', icon: Camera, label: t.navSnap },
            { id: 'bill', icon: ReceiptText, label: t.navBill },
            { id: 'slabs', icon: BarChart3, label: t.navSlabs },
            { id: 'settings', icon: Settings, label: t.navSettings },
          ] as { id: NavigationTab; icon: React.FC<{ className?: string }>; label: string }[]
        ).map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center px-1 transition-colors ${
                isActive ? 'text-amber-700 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <IconComp className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ONBOARDING / FIRST-TIME SETUP MODAL */}
      {showOnboarding && (
        <OnboardingWizard
          household={household}
          onComplete={(updates, latestKwh) => {
            handleUpdateHousehold(updates, latestKwh);
            setShowOnboarding(false);
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
