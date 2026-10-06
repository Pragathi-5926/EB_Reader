export type Language = 'en' | 'ta';

export type NavigationTab = 'dashboard' | 'snap' | 'bill' | 'slabs' | 'settings';

export interface Household {
  id: string;
  name: string;
  serviceNumber: string;
  language: Language;
  lastOfficialReading: number;
  lastOfficialReadingDate: string; // YYYY-MM-DD
  cycleStartDate: string; // YYYY-MM-DD
  largeText: boolean;
  alertsEnabled: boolean;
  weeklyReminderEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface MeterReading {
  id: string;
  householdId: string;
  readingValue: number; // cumulative kWh
  timestamp: string; // ISO string
  source: 'camera' | 'manual';
  confidence?: string;
  meterType?: string;
}

export interface SlabBreakdownItem {
  id: string;
  rangeLabel: string;
  labelEn: string;
  labelTa: string;
  from: number;
  to: number;
  units: number;
  rate: number;
  cost: number;
  isFree: boolean;
  isCliffPenalty?: boolean;
}

export type UsageZone = 'safe' | 'warning' | 'cliff';

export interface BillEstimate {
  unitsUsed: number;
  freeUnits: number;
  chargeableUnits: number;
  totalCost: number;
  breakdown: SlabBreakdownItem[];
  isOver500: boolean;
  costAt500: number;
  extraCostFromCliff: number;
  lostFreeUnitsPenalty: number;
  unitsAbove500Cost: number;
  zone: UsageZone;
}

export interface AlertItem {
  id: string;
  type: 'near_450' | 'crossed_500' | 'weekly_reminder';
  units: number;
  estimatedBill: number;
  timestamp: string;
  dismissed: boolean;
}
