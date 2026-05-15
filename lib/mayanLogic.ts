// lib/mayanLogic.ts
import { MAYAN_TONES, MAYAN_TOTEMS } from './data/mayanData';

// Constants
const MAYAN_EPOCH_JD = 2459762; // Kin 1 (Red Magnetic Dragon) epoch base (e.g. recent known cycle)

export interface MayanFiveForces {
  destiny: { kin: number; tone: number; totem: number };
  support: { kin: number; tone: number; totem: number };
  challenge: { kin: number; tone: number; totem: number };
  hidden: { kin: number; tone: number; totem: number };
  guide: { kin: number; tone: number; totem: number };
}

export interface MoonCalendar {
  moon: number;
  day: number;
}

/**
 * Calculate the Kin number (1-260) for a given Date.
 * Ignores Feb 29 (treats it same as Feb 28 to keep alignment).
 */
export function getMayanKin(date: Date): number {
  const y = date.getFullYear();
  let m = date.getMonth() + 1; // 1-12
  let d = date.getDate();

  // Dreamspell leap year exclusion: Feb 29 counts as Feb 28
  if (m === 2 && d === 29) {
    d = 28;
  }

  // Calculate Julian Day
  if (m < 3) {
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
  
  // Standard Julian offset for Kin 1 is often calculated backwards.
  // 1987-07-26 was Kin 34 (White Galactic Wizard).
  // Let's use a known precise epoch: 
  // 1987-07-26 (July 26, 1987) = Kin 34
  
  // The actual Dreamspell formula counts Days since July 26, 1987, excluding Feb 29s.
  // Let's implement the standard Dreamspell year-month-day lookup.
  
  // Actually, a simpler way is: 
  // Base Date: 1987-07-26 is Kin 34.
  // Let's calculate total days between input date and 1987-07-26, minus leap days between them.
  const baseDate = new Date("1987-07-26T00:00:00Z");
  const targetDate = new Date(Date.UTC(y, date.getMonth(), d)); // Already adjusted Feb 29 -> Feb 28
  
  let daysDiff = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000);
  
  // Count how many Feb 29s occurred between baseDate and targetDate
  let leapDays = 0;
  let startYear = Math.min(1987, y);
  let endYear = Math.max(1987, y);
  for (let year = startYear; year <= endYear; year++) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      // Leap year
      const feb29 = new Date(Date.UTC(year, 1, 29));
      if (year === 1987 && baseDate > feb29) continue;
      if (year === y && targetDate < feb29) continue;
      
      // If baseDate is before feb29 and targetDate is after (or vice versa), count it
      if (baseDate.getTime() <= feb29.getTime() && targetDate.getTime() >= feb29.getTime()) {
        leapDays++;
      } else if (baseDate.getTime() >= feb29.getTime() && targetDate.getTime() <= feb29.getTime()) {
        leapDays++;
      }
    }
  }

  // If target date is before base date, daysDiff is negative, leap days should be added back
  if (daysDiff < 0) {
    daysDiff += leapDays;
  } else {
    daysDiff -= leapDays;
  }

  let kin = (34 + daysDiff) % 260;
  if (kin <= 0) kin += 260;
  
  return kin;
}

export function getKinDetails(kin: number) {
  const tone = ((kin - 1) % 13) + 1; // 1-13
  const totem = ((kin - 1) % 20) + 1; // 1-20
  return { kin, tone, totem };
}

export function getKinFromTotemTone(totem: number, tone: number): number {
  for (let k = 1; k <= 260; k++) {
    if (((k - 1) % 13) + 1 === tone && ((k - 1) % 20) + 1 === totem) {
      return k;
    }
  }
  return 1;
}

export function getFiveForces(kin: number): MayanFiveForces {
  const destiny = getKinDetails(kin);
  
  // Support (Analog): Totem = (19 - Main) or 20, Tone = Main
  let supportTotem = 19 - destiny.totem;
  if (supportTotem <= 0) supportTotem += 20;
  const support = { ...getKinDetails(getKinFromTotemTone(supportTotem, destiny.tone)) };

  // Challenge (Antipode): Totem = (Main + 10) % 20 || 20, Tone = Main
  let challengeTotem = (destiny.totem + 10) % 20;
  if (challengeTotem === 0) challengeTotem = 20;
  const challenge = { ...getKinDetails(getKinFromTotemTone(challengeTotem, destiny.tone)) };

  // Hidden (Occult): Totem = (21 - Main) || 20, Tone = 14 - Main Tone
  let hiddenTotem = 21 - destiny.totem;
  if (hiddenTotem === 0) hiddenTotem = 20;
  const hiddenTone = 14 - destiny.tone;
  const hidden = { ...getKinDetails(getKinFromTotemTone(hiddenTotem, hiddenTone)) };

  // Guide
  let guideTotemOffset = 0;
  switch (destiny.tone) {
    case 1: case 6: case 11: guideTotemOffset = 0; break;
    case 2: case 7: case 12: guideTotemOffset = 12; break;
    case 3: case 8: case 13: guideTotemOffset = 4; break;
    case 4: case 9: guideTotemOffset = 16; break;
    case 5: case 10: guideTotemOffset = 8; break;
  }
  let guideTotem = (destiny.totem + guideTotemOffset) % 20;
  if (guideTotem === 0) guideTotem = 20;
  const guide = { ...getKinDetails(getKinFromTotemTone(guideTotem, destiny.tone)) };

  return { destiny, support, challenge, hidden, guide };
}

export function getWavespell(kin: number) {
  const { tone } = getKinDetails(kin);
  let startKin = kin - tone + 1;
  if (startKin <= 0) startKin += 260;
  return getKinDetails(startKin);
}

export function get13MoonCalendar(date: Date): MoonCalendar {
  const y = date.getFullYear();
  let m = date.getMonth();
  let d = date.getDate();
  
  if (m === 1 && d === 29) {
    d = 28;
  }

  const targetDate = new Date(Date.UTC(y, m, d));
  
  // Find the closest July 26th that is BEFORE or EQUAL to the target date
  let yearStart = new Date(Date.UTC(y, 6, 26)); // July is 6
  if (targetDate < yearStart) {
    yearStart = new Date(Date.UTC(y - 1, 6, 26));
  }

  let daysDiff = Math.round((targetDate.getTime() - yearStart.getTime()) / 86400000);
  
  // Subtract leap days between yearStart and targetDate
  let leapYear = targetDate.getUTCFullYear();
  if ((leapYear % 4 === 0 && leapYear % 100 !== 0) || leapYear % 400 === 0) {
    const feb29 = new Date(Date.UTC(leapYear, 1, 29));
    if (yearStart < feb29 && targetDate >= feb29) {
      daysDiff--;
    }
  }

  // If it's Day Out of Time (July 25th)
  if (daysDiff === 364) {
    return { moon: 0, day: 0 }; // Day Out of Time
  }

  const moon = Math.floor(daysDiff / 28) + 1;
  const day = (daysDiff % 28) + 1;

  return { moon, day };
}
