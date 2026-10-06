import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Zap,
  ThermometerSnowflake,
  Flame,
  Shirt,
} from 'lucide-react';
import { Household } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateEstimatedBill } from '../utils/tariffCalculator';

interface SlabExplanationViewProps {
  household: Household;
  actualUnitsUsed: number;
  mode: 'bill' | 'slabs';
  onSwitchMode: (mode: 'bill' | 'slabs') => void;
}

export const SlabExplanationView: React.FC<SlabExplanationViewProps> = ({
  household,
  actualUnitsUsed,
  mode,
  onSwitchMode,
}) => {
  const lang = household.language;
  const t = TRANSLATIONS[lang];

  const [simulatedUnits, setSimulatedUnits] = useState<number>(actualUnitsUsed);

  const billEstimate = calculateEstimatedBill(simulatedUnits);
  const billAt500 = calculateEstimatedBill(500);
  const compareUnitsForChart = simulatedUnits > 500 ? simulatedUnits : 510;
  const billAtCompare = calculateEstimatedBill(compareUnitsForChart);

  const maxBarCost = Math.max(billAt500.totalCost, billAtCompare.totalCost, 2400);

  return (
    <div className="space-y-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {mode === 'bill' ? t.billTitle : t.slabGuideTitle}
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-1.5 max-w-2xl">
            {mode === 'bill' ? t.billSubtitle : t.slabGuideSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl self-start">
          <button
            type="button"
            onClick={() => onSwitchMode('bill')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'bill'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.navBill}
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('slabs')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'slabs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.navSlabs}
          </button>
        </div>
      </div>

      {/* Interactive "What-If" Usage Slider (Available on both views so users can feel the 500-unit cliff live) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.whatIfSimulatorTitle}</h2>
            <p className="text-xs text-slate-600 mt-0.5">{t.whatIfSimulatorSub}</p>
          </div>
          {simulatedUnits !== actualUnitsUsed && (
            <button
              type="button"
              onClick={() => setSimulatedUnits(actualUnitsUsed)}
              className="min-h-[40px] px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {t.resetToActualBtn} ({actualUnitsUsed})
              </span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono">
            <span className="text-sm text-slate-600">
              {t.unitsUsedLabel}:{' '}
              <strong className="text-xl text-slate-900 tabular-nums">{simulatedUnits}</strong> kWh
            </span>
            <span
              className={`text-lg font-bold tabular-nums ${
                billEstimate.isOver500 ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              ₹{billEstimate.totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <input
            type="range"
            min={50}
            max={750}
            step={1}
            value={simulatedUnits}
            onChange={(e) => setSimulatedUnits(parseInt(e.target.value, 10))}
            aria-label="Simulated electricity units"
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />

          {/* Quick Jump Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { u: 200, label: '200 kWh (₹0 Free)' },
              { u: 320, label: '320 kWh (₹564)' },
              { u: 450, label: '450 kWh (₹1,255)' },
              { u: 500, label: '500 kWh (₹1,570 Safe Max)' },
              { u: 510, label: '510 kWh (₹2,124 Cliff!)' },
              { u: 600, label: '600 kWh (₹2,880)' },
            ].map((preset) => (
              <button
                key={preset.u}
                type="button"
                onClick={() => setSimulatedUnits(preset.u)}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors whitespace-nowrap tabular-nums ${
                  simulatedUnits === preset.u
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'bill' ? (
        /* DETAILED BILL BREAKDOWN VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Cols: Slab Breakdown Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {lang === 'en'
                    ? `TANGEDCO Bi-Monthly Bill Calculation (${simulatedUnits} Units)`
                    : `TANGEDCO 2-மாத மின் கட்டணக் கணக்கீடு (${simulatedUnits} யூனிட்கள்)`}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>
                    {t.freeUnitsActive}:{' '}
                    <strong className="text-slate-800">{billEstimate.freeUnits} kWh</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'en' ? 'Chargeable Units' : 'கட்டணத்திற்குரிய யூனிட்கள்'}:{' '}
                    <strong className="text-slate-800">{billEstimate.chargeableUnits} kWh</strong>
                  </span>
                </div>
              </div>
              <div className="text-right font-mono tabular-nums">
                <div className="text-xs text-slate-500">{t.estimatedBillLabel}</div>
                <div className="text-2xl font-bold text-slate-900">
                  ₹{billEstimate.totalCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-5">{t.tableColSlab}</th>
                    <th className="py-3.5 px-4 text-right">{t.tableColUnits}</th>
                    <th className="py-3.5 px-4 text-right">{t.tableColRate}</th>
                    <th className="py-3.5 px-5 text-right">{t.tableColAmount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {billEstimate.breakdown.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        row.isCliffPenalty
                          ? 'bg-red-50/50'
                          : row.isFree
                          ? 'bg-emerald-50/40'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900 font-mono tabular-nums">
                          {row.rangeLabel} {lang === 'en' ? 'Units' : 'யூனிட்கள்'}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {lang === 'en' ? row.labelEn : row.labelTa}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-800">
                        {row.units}
                      </td>
                      <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-600">
                        {row.isFree ? (lang === 'en' ? 'FREE' : 'இலவசம்') : `₹${row.rate.toFixed(2)}`}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-semibold tabular-nums text-slate-900">
                        ₹{row.cost.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
                    <td className="py-4 px-5 text-base">{t.totalEstimatedRow}</td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      {billEstimate.unitsUsed}
                    </td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-5 text-right font-mono text-xl tabular-nums text-amber-700">
                      ₹{billEstimate.totalCost.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Right 4 Cols: Slab Impact Summary Callout */}
          <div className="lg:col-span-4 space-y-6">
            {billEstimate.isOver500 ? (
              <div className="bg-red-50/80 border border-red-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-950">
                      {t.cliffPenaltyCalloutTitle}
                    </h3>
                    <p className="text-xs text-red-900 mt-1 leading-relaxed">
                      {t.cliffPenaltyCalloutDesc}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-red-200 rounded-xl space-y-2 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-slate-600">
                    <span>{lang === 'en' ? 'Bill at 500 units:' : '500 யூனிட்டில் பில்:'}</span>
                    <span>₹1,570</span>
                  </div>
                  <div className="flex justify-between text-red-700 font-semibold">
                    <span>
                      {lang === 'en' ? 'Lost 100 free units (101–200):' : 'இழந்த 100 இலவச யூனிட்:'}
                    </span>
                    <span>+₹470</span>
                  </div>
                  <div className="flex justify-between text-red-700 font-semibold">
                    <span>
                      {lang === 'en'
                        ? `Units above 500 (${simulatedUnits - 500} kWh):`
                        : `500-க்கு மேல் (${simulatedUnits - 500} யூனிட்):`}
                    </span>
                    <span>+₹{billEstimate.unitsAbove500Cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                    <span>{t.cliffDiffLabel}:</span>
                    <span className="text-red-600">
                      +₹{billEstimate.extraCostFromCliff.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-950">
                      {t.under500CalloutTitle}
                    </h3>
                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                      {t.under500CalloutDesc}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-2 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {lang === 'en' ? 'Remaining to 500 limit:' : '500 வரம்பிற்கு பாக்கி:'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {500 - simulatedUnits} {lang === 'en' ? 'units' : 'யூனிட்கள்'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{lang === 'en' ? 'Free units applied:' : 'இலவச யூனிட்கள்:'}</span>
                    <span className="font-bold text-emerald-700">200 kWh (₹0)</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSwitchMode('slabs')}
              className="w-full min-h-[48px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl flex items-center justify-between transition-colors"
            >
              <span>{t.btnWhyBillJumps}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* VISUAL SLAB EXPLANATION SCREEN */
        <div className="space-y-8">
          {/* Bar Chart Comparison Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">{t.chartComparisonTitle}</h2>
              <span className="text-xs font-mono text-red-700 font-semibold tabular-nums">
                {t.cliffDiffLabel}: +₹
                {(billAtCompare.totalCost - billAt500.totalCost).toLocaleString('en-IN')} (
                {compareUnitsForChart - 500}{' '}
                {lang === 'en' ? 'extra units above 500' : 'கூடுதல் யூனிட்கள்'})
              </span>
            </div>

            <div className="space-y-5">
              {/* Bar 1: At 500 Units */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">
                    {t.bar500Label} · <span className="font-mono">500 kWh</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums text-base">
                    ₹1,570
                  </span>
                </div>
                <div className="w-full h-10 bg-slate-100 rounded-xl overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (billAt500.totalCost / maxBarCost) * 100)}%` }}
                    className="bg-emerald-600 h-full flex items-center px-3 text-xs font-mono font-semibold text-white whitespace-nowrap"
                  >
                    200 Free + 300 Billed = ₹1,570
                  </div>
                </div>
              </div>

              {/* Bar 2: At 510 (or current >500) Units */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">
                    {t.barCurrentLabel} ·{' '}
                    <span className="font-mono">{compareUnitsForChart} kWh</span>
                  </span>
                  <span className="font-mono font-bold text-red-600 tabular-nums text-base">
                    ₹{billAtCompare.totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-10 bg-slate-100 rounded-xl overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (billAt500.totalCost / maxBarCost) * 100)}%` }}
                    className="bg-slate-700 h-full flex items-center px-3 text-xs font-mono text-white whitespace-nowrap"
                  >
                    ₹1,570 Base
                  </div>
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        ((billAtCompare.totalCost - billAt500.totalCost) / maxBarCost) * 100
                      )}%`,
                    }}
                    className="bg-red-600 h-full flex items-center px-3 text-xs font-mono font-bold text-white whitespace-nowrap"
                  >
                    +₹{billAtCompare.totalCost - billAt500.totalCost} Cliff Jump
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Visual Rule Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-emerald-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold">{t.ruleUnder500Title}</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-emerald-700">01.</span>
                  <span>{t.ruleUnder500Bullet1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-emerald-700">02.</span>
                  <span>{t.ruleUnder500Bullet2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-emerald-700">03.</span>
                  <span>{t.ruleUnder500Bullet3}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-red-800">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold">{t.ruleOver500Title}</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-red-600">01.</span>
                  <span>{t.ruleOver500Bullet1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-red-600">02.</span>
                  <span>{t.ruleOver500Bullet2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-red-600">03.</span>
                  <span>{t.ruleOver500Bullet3}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actionable Appliance Savings Tips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">{t.applianceTipTitle}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                  <ThermometerSnowflake className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{t.applianceTip1Title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.applianceTip1Desc}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t.applianceTip2Title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.applianceTip2Desc}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
                  <Shirt className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{t.applianceTip3Title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.applianceTip3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
