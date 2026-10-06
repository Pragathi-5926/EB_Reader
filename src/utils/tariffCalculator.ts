import { BillEstimate, SlabBreakdownItem, UsageZone } from '../types';

/**
 * Calculates the estimated bi-monthly TANGEDCO domestic electricity bill
 * under the Tamil Nadu Domestic Tariff Rules (post-May 2026 revision).
 *
 * Key Slab Cliff Mechanics:
 * - Consumption <= 500 units: First 200 units are FREE (₹0).
 *   - 001–200 units: ₹0.00 / unit (Free)
 *   - 201–400 units: ₹4.70 / unit (200 units = ₹940)
 *   - 401–500 units: ₹6.30 / unit (100 units = ₹630)
 *   -> Total at 500 units = ₹1,570
 *
 * - Consumption > 500 units: Only first 100 units are FREE (₹0).
 *   - 001–100 units: ₹0.00 / unit (Free)
 *   - 101–400 units: ₹4.70 / unit (300 units = ₹1,410 -> +₹470 penalty from losing 100 free units)
 *   - 401–500 units: ₹6.30 / unit (100 units = ₹630)
 *   - 501–600 units: ₹8.40 / unit (e.g., 10 units at 510 = ₹84)
 *   - 601–800 units: ₹9.45 / unit
 *   - 801–1000 units: ₹10.50 / unit
 *   - >1000 units: ₹11.55 / unit
 *   -> Total at 510 units = ₹2,124 (₹554 jump for just 10 extra units!)
 */
export function calculateEstimatedBill(rawUnits: number): BillEstimate {
  const unitsUsed = Math.max(0, Math.round(rawUnits));
  const isOver500 = unitsUsed > 500;
  const freeUnits = isOver500 ? 100 : Math.min(200, unitsUsed > 0 ? 200 : 200);
  const chargeableUnits = Math.max(0, unitsUsed - (isOver500 ? 100 : 200));

  let zone: UsageZone = 'safe';
  if (unitsUsed > 500) {
    zone = 'cliff';
  } else if (unitsUsed >= 450) {
    zone = 'warning';
  }

  const breakdown: SlabBreakdownItem[] = [];
  let totalCost = 0;

  if (!isOver500) {
    // Domestic Consumption <= 500 Units (200 Units Free Scheme)
    const freeBlockUnits = Math.min(unitsUsed, 200);
    breakdown.push({
      id: 'slab-free-200',
      rangeLabel: '1 – 200',
      labelEn: 'First 200 units (Subsidized Free Quota)',
      labelTa: 'முதல் 200 யூனிட்கள் (இலவச மின்சாரம்)',
      from: 1,
      to: 200,
      units: freeBlockUnits,
      rate: 0,
      cost: 0,
      isFree: true,
    });

    if (unitsUsed > 200) {
      const u201_400 = Math.min(unitsUsed - 200, 200);
      const cost201_400 = Math.round(u201_400 * 4.7 * 100) / 100;
      totalCost += cost201_400;
      breakdown.push({
        id: 'slab-201-400',
        rangeLabel: '201 – 400',
        labelEn: '201 to 400 units (Standard Domestic Slab)',
        labelTa: '201 முதல் 400 யூனிட்கள் வரை',
        from: 201,
        to: 400,
        units: u201_400,
        rate: 4.7,
        cost: cost201_400,
        isFree: false,
      });
    }

    if (unitsUsed > 400) {
      const u401_500 = Math.min(unitsUsed - 400, 100);
      const cost401_500 = Math.round(u401_500 * 6.3 * 100) / 100;
      totalCost += cost401_500;
      breakdown.push({
        id: 'slab-401-500',
        rangeLabel: '401 – 500',
        labelEn: '401 to 500 units (Upper Safe Slab)',
        labelTa: '401 முதல் 500 யூனிட்கள் வரை',
        from: 401,
        to: 500,
        units: u401_500,
        rate: 6.3,
        cost: cost401_500,
        isFree: false,
      });
    }
  } else {
    // Domestic Consumption > 500 Units (Free quota drops to 100 units!)
    breakdown.push({
      id: 'slab-free-100',
      rangeLabel: '1 – 100',
      labelEn: 'First 100 units (Reduced Free Quota >500)',
      labelTa: 'முதல் 100 யூனிட்கள் மட்டுமே இலவசம் (>500 தாண்டியதால்)',
      from: 1,
      to: 100,
      units: 100,
      rate: 0,
      cost: 0,
      isFree: true,
    });

    // 101-200 (Previously Free, now charged at ₹4.70 = ₹470 cliff penalty)
    breakdown.push({
      id: 'slab-101-200-penalty',
      rangeLabel: '101 – 200',
      labelEn: '101 to 200 units (Lost Free Quota — Billed after >500)',
      labelTa: '101 – 200 யூனிட்கள் (இழந்த 100 இலவச யூனிட் கட்டணம்)',
      from: 101,
      to: 200,
      units: 100,
      rate: 4.7,
      cost: 470,
      isFree: false,
      isCliffPenalty: true,
    });
    totalCost += 470;

    // 201-400 (200 units @ ₹4.70 = ₹940)
    breakdown.push({
      id: 'slab-201-400',
      rangeLabel: '201 – 400',
      labelEn: '201 to 400 units',
      labelTa: '201 முதல் 400 யூனிட்கள் வரை',
      from: 201,
      to: 400,
      units: 200,
      rate: 4.7,
      cost: 940,
      isFree: false,
    });
    totalCost += 940;

    // 401-500 (100 units @ ₹6.30 = ₹630)
    breakdown.push({
      id: 'slab-401-500',
      rangeLabel: '401 – 500',
      labelEn: '401 to 500 units',
      labelTa: '401 முதல் 500 யூனிட்கள் வரை',
      from: 401,
      to: 500,
      units: 100,
      rate: 6.3,
      cost: 630,
      isFree: false,
    });
    totalCost += 630;

    // Above 500 slabs
    const over500Slabs = [
      {
        id: 'slab-501-600',
        rangeLabel: '501 – 600',
        from: 501,
        to: 600,
        rate: 8.4,
        labelEn: '501 to 600 units (High Cliff Slab)',
        labelTa: '501 முதல் 600 யூனிட்கள் வரை (உயர் கட்டணப் பிரிவு)',
      },
      {
        id: 'slab-601-800',
        rangeLabel: '601 – 800',
        from: 601,
        to: 800,
        rate: 9.45,
        labelEn: '601 to 800 units',
        labelTa: '601 முதல் 800 யூனிட்கள் வரை',
      },
      {
        id: 'slab-801-1000',
        rangeLabel: '801 – 1000',
        from: 801,
        to: 1000,
        rate: 10.5,
        labelEn: '801 to 1000 units',
        labelTa: '801 முதல் 1000 யூனிட்கள் வரை',
      },
      {
        id: 'slab-1000-plus',
        rangeLabel: '> 1000',
        from: 1001,
        to: Infinity,
        rate: 11.55,
        labelEn: 'Above 1000 units',
        labelTa: '1000 யூனிட்களுக்கு மேல்',
      },
    ];

    let remainingOver500 = unitsUsed - 500;
    for (const s of over500Slabs) {
      if (remainingOver500 <= 0) break;
      const maxInSlab = s.to === Infinity ? remainingOver500 : s.to - s.from + 1;
      const slabUnits = Math.min(remainingOver500, maxInSlab);
      const slabCost = Math.round(slabUnits * s.rate * 100) / 100;
      totalCost += slabCost;
      breakdown.push({
        id: s.id,
        rangeLabel: s.rangeLabel,
        labelEn: s.labelEn,
        labelTa: s.labelTa,
        from: s.from,
        to: s.to === Infinity ? unitsUsed : s.to,
        units: slabUnits,
        rate: s.rate,
        cost: slabCost,
        isFree: false,
        isCliffPenalty: true,
      });
      remainingOver500 -= slabUnits;
    }
  }

  const costAt500 = 1570; // Exact bill at 500 units (₹940 + ₹630)
  const roundedTotal = Math.round(totalCost);
  const extraCostFromCliff = isOver500 ? Math.max(0, roundedTotal - costAt500) : 0;
  const lostFreeUnitsPenalty = isOver500 ? 470 : 0;
  const unitsAbove500Cost = isOver500 ? Math.max(0, extraCostFromCliff - 470) : 0;

  return {
    unitsUsed,
    freeUnits,
    chargeableUnits,
    totalCost: roundedTotal,
    breakdown,
    isOver500,
    costAt500,
    extraCostFromCliff,
    lostFreeUnitsPenalty,
    unitsAbove500Cost,
    zone,
  };
}

/**
 * Generates a realistic high-contrast image of a TANGEDCO digital static single-phase
 * electricity meter showing the specified kWh reading on an HTML5 canvas, returning a PNG data URL.
 */
export function renderDigitalMeterImage(readingKwh: number, serviceNo = '09-241-008-412'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Outer casing background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Inner metallic face plate
  ctx.fillStyle = '#334155';
  ctx.fillRect(24, 24, canvas.width - 48, canvas.height - 48);

  // Headerplate text
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TANGEDCO — AC SINGLE PHASE 2 WIRE STATIC kWh METER', 52, 68);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText(`S.No: ${serviceNo}  |  240V  50Hz  5-30A  CL-1.0`, 52, 95);

  // Dark bezel around the LCD display
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(76, 125, 568, 175);

  // Backlit green-amber industrial LCD screen
  ctx.fillStyle = '#d9f99d';
  ctx.fillRect(94, 143, 532, 139);

  // Subtle LCD border
  ctx.strokeStyle = '#65a30d';
  ctx.lineWidth = 2;
  ctx.strokeRect(94, 143, 532, 139);

  // Top LCD indicators
  ctx.fillStyle = '#1a2e05';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('CUMULATIVE ENERGY', 114, 172);
  ctx.fillText('TNEB / TN', 515, 172);

  // 6-digit padded integer reading
  const digits = String(Math.max(0, Math.floor(readingKwh))).padStart(6, '0');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 78px "JetBrains Mono", monospace';
  ctx.fillText(digits, 118, 254);

  // Unit label on LCD
  ctx.font = 'bold 30px "JetBrains Mono", monospace';
  ctx.fillText('kWh', 515, 252);

  // Bottom meter specs & calibration LED
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(96, 355, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('3200 imp/kWh (CAL)', 120, 360);
  ctx.fillText('PROPERTY OF TANGEDCO TAMIL NADU', 390, 360);

  return canvas.toDataURL('image/png');
}
