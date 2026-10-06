import React, { useState } from 'react';
import { Check, Bell, Type as TypeIcon, Globe, HelpCircle, Play } from 'lucide-react';
import { Household, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface SettingsViewProps {
  household: Household;
  onUpdateHousehold: (updates: Partial<Household>) => void;
  onTriggerWeeklyReminder: () => void;
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  household,
  onUpdateHousehold,
  onTriggerWeeklyReminder,
  onOpenOnboarding,
}) => {
  const lang = household.language;
  const t = TRANSLATIONS[lang];

  const [name, setName] = useState(household.name);
  const [serviceNumber, setServiceNumber] = useState(household.serviceNumber);
  const [baselineReading, setBaselineReading] = useState(String(household.lastOfficialReading));
  const [baselineDate, setBaselineDate] = useState(household.lastOfficialReadingDate);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedReading = Math.max(0, parseInt(baselineReading, 10) || 0);
    onUpdateHousehold({
      name: name.trim() || 'Home',
      serviceNumber: serviceNumber.trim(),
      lastOfficialReading: parsedReading,
      lastOfficialReadingDate: baselineDate,
      cycleStartDate: baselineDate,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {t.settingsTitle}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 font-mono">
            <span>{household.name}</span>
            <span aria-hidden="true">·</span>
            <span>{household.serviceNumber || 'TANGEDCO Domestic'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenOnboarding}
          className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors self-start whitespace-nowrap"
        >
          {t.setupWizardBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Cols: Household & Baseline Reading Form */}
        <form
          onSubmit={handleSaveConnection}
          className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
        >
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t.connectionSectionTitle}
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.labelBaselineReading}
              </label>
              <input
                type="number"
                min={0}
                max={999999}
                value={baselineReading}
                onChange={(e) => setBaselineReading(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-300 rounded-xl font-mono font-bold tabular-nums text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.labelBaselineDate}
              </label>
              <input
                type="date"
                value={baselineDate}
                onChange={(e) => setBaselineDate(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              type="submit"
              className="min-h-[48px] px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              <span>{t.btnSaveSettings}</span>
            </button>

            {savedToast && (
              <span className="text-xs font-semibold text-emerald-700">{t.settingsSavedToast}</span>
            )}
          </div>
        </form>

        {/* Right 6 Cols: Language, Large Text & Notification Preferences */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t.preferencesSectionTitle}
          </h2>

          {/* Language Switcher */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {lang === 'en' ? 'App Language / மொழி' : 'செயலியின் மொழி / Language'}
                </div>
                <div className="text-xs text-slate-500">
                  {lang === 'en'
                    ? 'Switch full interface between Tamil and English'
                    : 'தமிழ் மற்றும் ஆங்கிலம் இடையே மாற்றவும்'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
              {(['ta', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onUpdateHousehold({ language: l })}
                  className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    household.language === l
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l === 'ta' ? 'தமிழ்' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Large Text Mode for Elders */}
          <div className="flex items-center justify-between gap-4 py-2 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <TypeIcon className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-900">{t.largeTextLabel}</div>
                <div className="text-xs text-slate-500">{t.toggleLargeTextDesc}</div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={household.largeText}
              onClick={() => onUpdateHousehold({ largeText: !household.largeText })}
              className={`min-h-[36px] w-14 rounded-full p-1 transition-colors flex items-center ${
                household.largeText ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-xs block" />
            </button>
          </div>

          {/* 450 & 500 Unit Threshold Alerts */}
          <div className="flex items-center justify-between gap-4 py-2 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {lang === 'en' ? '450 & 500 Unit Slab Alerts' : '450 & 500 யூனிட் எச்சரிக்கை'}
                </div>
                <div className="text-xs text-slate-500">{t.toggleAlertsDesc}</div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={household.alertsEnabled}
              onClick={() => onUpdateHousehold({ alertsEnabled: !household.alertsEnabled })}
              className={`min-h-[36px] w-14 rounded-full p-1 transition-colors flex items-center ${
                household.alertsEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-xs block" />
            </button>
          </div>

          {/* Weekly Meter Photo Reminder */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {lang === 'en' ? 'Weekly Meter Photo Reminder' : 'வாராந்திர போட்டோ நினைவூட்டல்'}
                  </div>
                  <div className="text-xs text-slate-500">{t.toggleWeeklyReminderDesc}</div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={household.weeklyReminderEnabled}
                onClick={() =>
                  onUpdateHousehold({ weeklyReminderEnabled: !household.weeklyReminderEnabled })
                }
                className={`min-h-[36px] w-14 rounded-full p-1 transition-colors flex items-center ${
                  household.weeklyReminderEnabled
                    ? 'bg-emerald-600 justify-end'
                    : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-xs block" />
              </button>
            </div>

            <button
              type="button"
              onClick={onTriggerWeeklyReminder}
              className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.btnTestAlert}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Help & FAQ Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">{t.faqSectionTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">{t.faq1Q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.faq1A}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">{t.faq2Q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.faq2A}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">{t.faq3Q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.faq3A}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
