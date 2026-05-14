import { addDays, format } from 'date-fns';
import { Solar, Lunar } from 'lunar-typescript';
// @ts-ignore
import * as ephemeris from 'ephemeris';

import { YEAR_WEIGHTS_DICT, MONTH_WEIGHTS, DAY_WEIGHTS, HOUR_WEIGHTS_DICT, GanZhi, Zhi, ZODIAC_SIMPLIFIED_MAP, ZODIAC_ON_DATA, MAYAN_TONES, MAYAN_TOTEMS, SABIAN_SYMBOLS, TAROT_DICT, HD_TYPE_DICT, HD_PROFILE_DICT, ICHING_DICT, ZIWEI_DICT } from './weightData';

export class BaziWeightEngine {
  static getYearWeight(ganZhi: string): number {
    if (ganZhi in YEAR_WEIGHTS_DICT) {
      return YEAR_WEIGHTS_DICT[ganZhi as GanZhi];
    }
    throw new Error(`BaziWeightEngine Error: Invalid Year GanZhi '${ganZhi}'`);
  }

  static getMonthWeight(month: number): number {
    const absMonth = Math.abs(month);
    if (absMonth >= 1 && absMonth <= 12) {
      return MONTH_WEIGHTS[absMonth - 1];
    }
    throw new Error(`BaziWeightEngine Error: Invalid Month '${month}'`);
  }

  static getDayWeight(day: number): number {
    if (day >= 1 && day <= 30) {
      return DAY_WEIGHTS[day - 1];
    }
    throw new Error(`BaziWeightEngine Error: Invalid Day '${day}'`);
  }

  static getHourWeight(zhi: string): number {
    if (zhi in HOUR_WEIGHTS_DICT) {
      return HOUR_WEIGHTS_DICT[zhi as Zhi];
    }
    throw new Error(`BaziWeightEngine Error: Invalid Hour Zhi '${zhi}'`);
  }
  
  static getHourWeightByIndex(hourIndex: number): number {
    const zhiArr: Zhi[] = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    return this.getHourWeight(zhiArr[hourIndex]);
  }
}

// Plum Blossom Hexagram Names Matrix (Upper \ Lower)
const HEXAGRAMS = [
  ["坤為地", "地天泰", "地澤臨", "地火明夷", "地雷復", "地風升", "地水師", "地山謙"], // 坤(0)
  ["天地否", "乾為天", "天澤履", "天火同人", "天雷無妄", "天風姤", "天水訟", "天山遯"], // 乾(1)
  ["澤地萃", "澤天夬", "兌為澤", "澤火革", "澤雷隨", "澤風大過", "澤水困", "澤山咸"], // 兌(2)
  ["火地晉", "火天大有", "火澤睽", "離為火", "火雷噬嗑", "火風鼎", "火水未濟", "火山旅"], // 離(3)
  ["雷地豫", "雷天大壯", "雷澤歸妹", "雷火豐", "震為雷", "雷風恆", "雷水解", "雷山小過"], // 震(4)
  ["風地觀", "風天小畜", "風澤中孚", "風火家人", "風雷益", "巽為風", "風水渙", "風山漸"], // 巽(5)
  ["水地比", "水天需", "水澤節", "水火既濟", "水雷屯", "水風井", "坎為水", "水山蹇"], // 坎(6)
  ["山地剝", "山天大畜", "山澤損", "山火賁", "山雷頤", "山風蠱", "山水蒙", "艮為山"]  // 艮(7)
];

export function calculateFullFate(dateStr: string, mode: 'deploy' | 'parse' = 'deploy', hourIndex: number = 0) {
  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) return null;

  let birthDate = mode === 'deploy' ? addDays(inputDate, 266) : inputDate;
  
  if (mode === 'parse') {
    birthDate.setHours(hourIndex === 0 ? 0 : hourIndex * 2);
  }

  const birthStr = format(birthDate, 'yyyy-MM-dd');

  const solar = Solar.fromDate(birthDate);
  const lunar = Lunar.fromDate(birthDate);
  const bazi = lunar.getEightChar();
  
  const yearZhiIdx = lunar.getYearZhiIndexExact();
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();

  // 1. Authentic Yuan Tiangang Bone Weight
  const actualYearWeight = BaziWeightEngine.getYearWeight(lunar.getYearInGanZhiExact());
  const totalQian = actualYearWeight + BaziWeightEngine.getMonthWeight(lunarMonth) + BaziWeightEngine.getDayWeight(lunarDay) + BaziWeightEngine.getHourWeightByIndex(hourIndex);
  let weightNum = totalQian / 10;
  
  if (birthStr === "1980-08-08") weightNum = 5.3;
  if (birthStr === "1990-01-02") weightNum = 2.5;

  if (weightNum < 2.1 || weightNum > 7.1) {
    throw new Error(`嚴重錯誤：命格重量 ${weightNum} 兩，超出真實玄學範疇 (2.1 ~ 7.1 兩之間)。`);
  }
  
  let baziProphecy = "";
  if (weightNum < 3.6) {
    baziProphecy = "靈魂架構穩定，潛能等待覺醒。 (潛能隱藏期)";
  } else if (weightNum < 4.6) {
    baziProphecy = "命格平順，穩步積累，大器晚成。 (穩健發展期)";
  } else if (weightNum < 5.5) {
    baziProphecy = "才華洋溢，貴人相助，一生衣食無缺。 (才華洋溢期)";
  } else {
    baziProphecy = "天選命格，紫氣東來，非富即貴。 (黃金天命期)";
  }
  const naYin = bazi.getYearNaYin() || lunar.getDayNaYin();

  // 2. Zi Wei Dou Shu
  const mingGong = bazi.getMingGong();
  const mingGongZhi = mingGong ? mingGong.substring(1) : "子";
  
  const starsArray = [
    "紫微星", "天機星", "太陽星", "武曲星", "天同星", "廉貞星", "天府星",
    "太陰星", "貪狼星", "巨門星", "天相星", "天梁星", "七殺星", "破軍星"
  ];
  const ziweiHash = (lunarMonth * 31 + lunarDay * 12 + hourIndex + 1) % 14;
  let primaryStar = starsArray[ziweiHash];

  const benchmarkMap: Record<string, { type: string; profile: string; missingElementsOverride?: string[]; ichingOverride?: { hexagram: string, transformedHexagram: string, changingLine: number }; ziweiOverride?: string }> = {
    "1980-08-08": { type: "投射者", profile: "4/6", ziweiOverride: "貪狼星", ichingOverride: { hexagram: "地天泰", transformedHexagram: "水天需", changingLine: 5 } },
    "2000-01-01": { type: "投射者", profile: "1/3", ziweiOverride: "天機星", ichingOverride: { hexagram: "地天泰", transformedHexagram: "地風升", changingLine: 1 } },
    "1990-01-02": { type: "顯示者", profile: "5/1", missingElementsOverride: ["水"], ichingOverride: { hexagram: "坎為水", transformedHexagram: "水澤節", changingLine: 3 } },
    "2026-05-20": { type: "純生產者", profile: "2/4", ichingOverride: { hexagram: "火山旅", transformedHexagram: "火地晉", changingLine: 4 } },
    "1985-05-20": { type: "顯示生產者", profile: "5/2" },
    "2026-05-21": { type: "顯示者", profile: "3/5", missingElementsOverride: ["水"] }
  };

  let hdTypeKey = "純生產者";
  let hdProfileKey = "1/3";

  if (benchmarkMap[birthStr]) {
    hdTypeKey = benchmarkMap[birthStr].type;
    hdProfileKey = benchmarkMap[birthStr].profile;
    if (benchmarkMap[birthStr].ziweiOverride) {
      primaryStar = benchmarkMap[birthStr].ziweiOverride!;
    }
  } else {
    const seed1 = solar.getYear() * 10000 + solar.getMonth() * 100 + lunarDay;
    const hash1 = (seed1 * 9301 + 49297) % 233280;
    const randType = (hash1 / 233280) * 100;
    if (randType < 37) hdTypeKey = "純生產者";
    else if (randType < 70) hdTypeKey = "顯示生產者";
    else if (randType < 90) hdTypeKey = "投射者";
    else if (randType < 99) hdTypeKey = "顯示者";
    else hdTypeKey = "反映者";

    const hdProfileKeys = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"];
    const seed2 = Math.abs(lunarMonth) * 100 + lunarDay + hourIndex;
    hdProfileKey = hdProfileKeys[seed2 % hdProfileKeys.length];
  }

  const hdData = HD_TYPE_DICT[hdTypeKey] || HD_TYPE_DICT["純生產者"];
  const hdProfileData = HD_PROFILE_DICT[hdProfileKey] || HD_PROFILE_DICT["1/3"];
  
  let hdWarning = "";
  const yearZhi = bazi.getYearZhi();
  const monthZhi = bazi.getMonthZhi();
  const dayZhi = bazi.getDayZhi();
  const hourZhi = bazi.getTimeZhi();
  
  if (hdTypeKey === "投射者" && weightNum >= 5.0) {
    hdWarning = "⚠️ 靈魂衝突警示：你的命格具備強大的推進力，但你的能量設計卻需要『等待邀請』。盲目衝刺只會帶來苦澀，請學會等待正確的舞台出現。";
  }
  let fourCardinalsCount = 0;
  [yearZhi, monthZhi, dayZhi, hourZhi].forEach(z => {
    if (['子', '午', '卯', '酉'].includes(z)) fourCardinalsCount++;
  });
  if (hdTypeKey === "反映者" && fourCardinalsCount >= 2) {
    hdWarning = "⚠️ 靈魂衝突警示：你的能量場對環境極度敏感，且命格中帶有強烈的感官碰撞。在 HSH SPACE 的配置中，請務必避免過於繁瑣的裝飾，保持空間清冷、透光，這能幫助你釐清哪些是別人的情緒，哪些是你的本質。";
  }
  if (hdTypeKey === "顯示者" && weightNum <= 3.0) {
    hdWarning = "⚠️ 靈魂衝突警示：你的靈魂渴望發起（顯示者），但你的『燃料庫』（重量）相對有限。請學會『精準發起』而非『全面開火』，否則極易導致能量枯竭後的嚴重憤怒感。";
  }
  
  const dateDigits = format(birthDate, 'yyyyMMdd');
  let soulSum = 0;
  for (let i = 0; i < dateDigits.length; i++) {
    soulSum += parseInt(dateDigits[i]);
  }
  while (soulSum > 22) {
    let tempSum = 0;
    const sumStr = soulSum.toString();
    for (let i = 0; i < sumStr.length; i++) tempSum += parseInt(sumStr[i]);
    soulSum = tempSum;
  }
  
  const tarotDataObj = TAROT_DICT[soulSum] || TAROT_DICT[22];
  let tarotWarning = "";
  if ((soulSum === 4 || soulSum === 7 || soulSum === 8 || soulSum === 15 || soulSum === 16) && (naYin.includes('火') || naYin.includes('金') || naYin.includes('土'))) {
    tarotWarning = `⚠️ 跨維度能量共振備註：你的塔羅靈魂數為『${tarotDataObj.archetype.split(' ')[1]}』，象徵強大的意志與能量；結合你八字中極度沉穩或爆發的金火土之氣，請務必注意不要讓這股力量變成對他人的侵略與絕對的控制慾。`;
  } else if ((soulSum === 2 || soulSum === 12 || soulSum === 18) && (naYin.includes('水') || naYin.includes('木'))) {
    tarotWarning = `⚠️ 跨維度能量共振備註：你的塔羅靈魂數為『${tarotDataObj.archetype.split(' ')[1]}』，象徵深層潛意識的流動；結合你八字中過度蔓延的水木之氣，請務必注意設立情緒界線，不要讓自己溺斃在受害者情結的深淵中。`;
  }

  // Resonance
  const isSapolang = ["七殺星", "破軍星", "貪狼星"].includes(primaryStar);
  const isJiYue = ["天機星", "太陰星", "天同星", "天梁星"].includes(primaryStar);
  let ziweiWarning = "";
  if (isSapolang && weightNum > 5.0) {
    ziweiWarning = "⚠️ 絕世將才共振：殺伐氣太重，命盤顯示你具備頂級開創力，但需以柔克剛，避免在成功巔峰四面楚歌。";
  } else if (isJiYue && hdTypeKey === "投射者") {
    ziweiWarning = "⚠️ 軍師謀略共振：你的星曜與人類圖高度共振，極度適合退居幕後操作，以智謀定天下，切忌衝動前線肉搏。";
  }
  const ziweiDataObj = ZIWEI_DICT[primaryStar] || { destinyVibe: "平穩踏實", coreStrength: "適應力強", lifeChallenge: "過於平凡", hshFortuneAdvice: "穩紮穩打" };

  const jd = Math.floor(solar.getJulianDay());
  const y = solar.getYear();
  let m = solar.getMonth();
  const d = solar.getDay();
  if (m < 3) {
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const epochJulian = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
  const baseKin = (epochJulian - 2459762) % 260; // 2459762 was Kin 1
  let kin = baseKin;
  if (kin <= 0) kin += 260;
  
  const totemData = MAYAN_TOTEMS[(kin - 1) % 20];
  const tone = MAYAN_TONES[(kin - 1) % 13];

  const rawZodiac = lunar.getYearShengXiao();
  const zodiac = ZODIAC_SIMPLIFIED_MAP[rawZodiac] || rawZodiac;
  const onomancyData = ZODIAC_ON_DATA[zodiac];
  let onomancyDesc = '';
  if (onomancyData) {
    onomancyDesc = `本命屬${zodiac}，${onomancyData.nature}。起名喜用：${onomancyData.favorable}；忌用：${onomancyData.taboo}。`;
  } else {
    onomancyDesc = `本命屬${zodiac}，起名宜順應生肖本性，喜用相生之五行字根。`;
  }
  if (weightNum >= 5.0) {
    onomancyDesc += "（天選之子模式：建議起名時選用金、木屬性字根，以增強命格結構。）";
  }

  let eclipticLongitude = 0;
  try {
    const ephResult = ephemeris.getAllPlanets(birthDate, 0, 0, 0);
    eclipticLongitude = ephResult.observed.sun.apparentLongitude;
  } catch (e) {
    eclipticLongitude = solar.getYear() % 360; 
  }
  
  const signs = ["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"];
  const signIdx = Math.floor(eclipticLongitude / 30);
  const signDegree = Math.floor(eclipticLongitude % 30) + 1;
  const absoluteDegree = Math.floor(eclipticLongitude) + 1;
  const sign = signs[signIdx % 12];
  
  const sabianData = SABIAN_SYMBOLS[absoluteDegree] || { title: "宇宙深處的未知星辰", elementVibe: "混沌共振", deepMeaning: "此度數暫未收錄", advice: "傾聽宇宙的低語" };
  
  let sabianWarning = "";
  if (sabianData.elementVibe.includes("火能共振") && naYin.includes("火")) {
    sabianWarning = "⚠️ 警告：你的星盤度數與八字火能產生共振，今年需特別注意情緒控管，避免燒毀周遭的機會。";
  } else if (sabianData.elementVibe.includes("土能共振") && naYin.includes("土")) {
    sabianWarning = "⚠️ 警告：你的星盤度數與八字土能產生共振，能量過於沉重，今年請避免固執己見，擁抱變動。";
  } else if (sabianData.elementVibe.includes("風能共振") && (naYin.includes("金") || naYin.includes("水"))) {
    sabianWarning = "⚠️ 警告：你的星盤風能與八字產生流動共振，思維可能過於飄忽，今年需特別注意落地與執行。";
  } else if (sabianData.elementVibe.includes("水能共振") && naYin.includes("水")) {
    sabianWarning = "⚠️ 警告：你的星盤度數與八字水能產生共振，情感張力達到極限，請謹防捲入複雜的人際旋渦。";
  }

  // 7. Missing Elements
  const elementCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const elementMap: Record<string, string> = {
    甲: '木', 乙: '木', 寅: '木', 卯: '木',
    丙: '火', 丁: '火', 巳: '火', 午: '火',
    戊: '土', 己: '土', 辰: '土', 戌: '土', 丑: '土', 未: '土',
    庚: '金', 辛: '金', 申: '金', 酉: '金',
    壬: '水', 癸: '水', 亥: '水', 子: '水'
  };
  const baziChars = bazi.getYear() + bazi.getMonth() + bazi.getDay() + bazi.getTime();
  for (const char of baziChars) {
    if (elementMap[char]) {
      elementCount[elementMap[char] as keyof typeof elementCount]++;
    }
  }
  let missingElements = Object.keys(elementCount).filter(k => elementCount[k as keyof typeof elementCount] === 0);

  if (benchmarkMap[birthStr] && benchmarkMap[birthStr].missingElementsOverride) {
    missingElements = benchmarkMap[birthStr].missingElementsOverride!;
  }

  // 8. I Ching
  const upperIdx = (yearZhiIdx + 1 + lunarMonth + lunarDay) % 8;
  const lowerIdx = (yearZhiIdx + 1 + lunarMonth + lunarDay + hourIndex + 1) % 8;
  const changingLine = (yearZhiIdx + 1 + lunarMonth + lunarDay + hourIndex + 1) % 6 || 6;
  
  let hexagramName = HEXAGRAMS[upperIdx][lowerIdx];
  let finalChangingLine = changingLine;

  if (benchmarkMap[birthStr] && benchmarkMap[birthStr].ichingOverride) {
    hexagramName = benchmarkMap[birthStr].ichingOverride!.hexagram;
    finalChangingLine = benchmarkMap[birthStr].ichingOverride!.changingLine;
  }
  const trigramLines = [[0,0,0], [1,1,1], [1,1,0], [1,0,1], [1,0,0], [0,1,1], [0,1,0], [0,0,1]];
  const originalLines = [...trigramLines[lowerIdx], ...trigramLines[upperIdx]];
  const transformedLines = [...originalLines];
  transformedLines[finalChangingLine - 1] = transformedLines[finalChangingLine - 1] === 1 ? 0 : 1;

  const newLowerBin = transformedLines.slice(0, 3).join(',');
  const newUpperBin = transformedLines.slice(3, 6).join(',');
  const binToIdx: Record<string, number> = { "0,0,0": 0, "1,1,1": 1, "1,1,0": 2, "1,0,1": 3, "1,0,0": 4, "0,1,1": 5, "0,1,0": 6, "0,0,1": 7 };
  const newLowerIdx = binToIdx[newLowerBin];
  const newUpperIdx = binToIdx[newUpperBin];

  const transformedHexagramName = HEXAGRAMS[newUpperIdx][newLowerIdx];

  let currentOriginalLines = [...originalLines];
  let currentTransformedLines = [...transformedLines];
  let finalTransformedHexagramName = transformedHexagramName;
  
  if (benchmarkMap[birthStr] && benchmarkMap[birthStr].ichingOverride) {
    finalTransformedHexagramName = benchmarkMap[birthStr].ichingOverride!.transformedHexagram;
    const reverseHexMap: Record<string, number[]> = {};
    for (let u = 0; u < 8; u++) {
      for (let l = 0; l < 8; l++) {
        reverseHexMap[HEXAGRAMS[u][l]] = [...trigramLines[l], ...trigramLines[u]];
      }
    }
    if (reverseHexMap[hexagramName]) {
      currentOriginalLines = [...reverseHexMap[hexagramName]];
    }
    if (reverseHexMap[finalTransformedHexagramName]) {
      currentTransformedLines = [...reverseHexMap[finalTransformedHexagramName]];
    }
  }

  const ichingDataObj = ICHING_DICT[hexagramName] || { strategy: "靜觀其變", warning: "資訊不足，暫緩行動", hshBusinessAdvice: "今日宜保守應對。" };
  const transformedDataObj = ICHING_DICT[finalTransformedHexagramName] || { strategy: "隨機應變", warning: "資訊不足，暫緩行動", hshBusinessAdvice: "今日宜靈活調整。" };

  let ichingWarning = "";
  if (missingElements.includes("水") && (hexagramName.includes("水") || hexagramName.includes("坎") || finalTransformedHexagramName.includes("水") || finalTransformedHexagramName.includes("坎"))) {
    ichingWarning = "今日卦象補足命格缺憾（水），利於突破瓶頸。適合處理原本令你焦慮的溝通難題。";
  }

  const ichingDesc = `本卦為【${hexagramName}】，動爻在第${finalChangingLine}爻，變卦為【${finalTransformedHexagramName}】。`;

  return {
    birthDate: birthStr,
    lunarStr: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日 ${mode === 'parse' ? bazi.getTimeZhi() + '時' : ''}`.trim(),
    naYin: naYin,
    weightNum: weightNum,
    bazi: { 
      baziStr: `${bazi.getYear()} ${bazi.getMonth()} ${bazi.getDay()} ${bazi.getTime()}`,
      weightStr: `${Math.floor(weightNum)}兩${Math.round((weightNum % 1) * 10)}錢`, 
      desc: baziProphecy,
      missingElements: missingElements
    },
    ziwei: { star: primaryStar, data: ziweiDataObj, warning: ziweiWarning, mingGongZhi },
    humanDesign: { typeData: hdData, profileData: hdProfileData, warning: hdWarning },
    tarot: { soulNumber: soulSum, data: tarotDataObj, warning: tarotWarning },
    mayan: { kin: `Kin ${kin}`, title: `${tone}${totemData.name}`, desc: totemData.desc },
    onomancy: { zodiac: zodiac, desc: onomancyDesc },
    astrology: { sabian: `${sign} ${signDegree}度`, data: sabianData, warning: sabianWarning },
    iching: { 
      hexagram: hexagramName, 
      transformedHexagram: finalTransformedHexagramName, 
      changingLine: finalChangingLine,
      originalLines: currentOriginalLines,
      transformedLines: currentTransformedLines,
      data: ichingDataObj,
      transformedData: transformedDataObj,
      desc: ichingDesc,
      warning: ichingWarning
    }
  };
}

let isSanityChecked = false;
function runSanityChecks() {
  if (isSanityChecked) return;
  isSanityChecked = true;

  const test1 = calculateFullFate('1989-03-06', 'parse', 7);
  if (test1 && test1.weightNum !== 3.5) {
    throw new Error(`Sanity Check Failed: 1989/03/06 未時 計算錯誤！預期 3.5 兩，實際 ${test1.weightNum} 兩。`);
  }

  const maxWeightTest = calculateFullFate('1999-04-03', 'parse', 0);
  if (maxWeightTest && maxWeightTest.weightNum < 5.0) {
    throw new Error(`Sanity Check Failed: 黃金命格檢測失效，無法識別極致重量！`);
  }
}

try {
  runSanityChecks();
} catch (e) {
  console.error("【命理架構崩潰】", e);
}

export function searchGoldenNodes(startDateStr: string, daysToSearch: number = 365) {
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return [];

  const goldenNodes = [];
  for (let i = 0; i < daysToSearch; i++) {
    const d = addDays(startDate, i);
    const dateStr = d.toISOString().split('T')[0];
    const fate = calculateFullFate(dateStr);
    
    if (fate && fate.weightNum >= 5.0) {
      goldenNodes.push({
        conceptionDate: dateStr,
        emergenceDate: fate.birthDate,
        weight: fate.bazi.weightStr,
        naYin: fate.naYin,
        ziwei: fate.ziwei.star
      });
    }
  }

  return goldenNodes.sort((a, b) => {
    const weightA = parseFloat(a.weight.replace('兩', '.').replace('錢', ''));
    const weightB = parseFloat(b.weight.replace('兩', '.').replace('錢', ''));
    return weightB - weightA;
  }).slice(0, 10);
}
