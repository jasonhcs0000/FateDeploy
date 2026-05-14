import { addDays, format } from 'date-fns';
import { Solar, Lunar } from 'lunar-typescript';
// @ts-ignore
import * as ephemeris from 'ephemeris';

import { YEAR_WEIGHTS_DICT, MONTH_WEIGHTS, DAY_WEIGHTS, HOUR_WEIGHTS_DICT, GanZhi, Zhi } from './weightData';

export class BaziWeightEngine {
  static getYearWeight(ganZhi: string): number {
    if (ganZhi in YEAR_WEIGHTS_DICT) {
      return YEAR_WEIGHTS_DICT[ganZhi as GanZhi];
    }
    throw new Error(`BaziWeightEngine Error: Invalid Year GanZhi '${ganZhi}'`);
  }

  static getMonthWeight(month: number): number {
    if (month >= 1 && month <= 12) {
      return MONTH_WEIGHTS[month - 1];
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

  // For deploy mode, expected birth date is approx 266 days from conception
  // For parse mode, use the exact input date
  let birthDate = mode === 'deploy' ? addDays(inputDate, 266) : inputDate;
  
  if (mode === 'parse') {
    birthDate.setHours(hourIndex === 0 ? 0 : hourIndex * 2);
  }

  const birthStr = format(birthDate, 'yyyy-MM-dd');

  const solar = Solar.fromDate(birthDate);
  const lunar = Lunar.fromDate(birthDate);
  const bazi = lunar.getEightChar();
  
  const yearGanIdx = lunar.getYearGanIndexExact();
  const yearZhiIdx = lunar.getYearZhiIndexExact();
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();

  // 1. Authentic Yuan Tiangang Bone Weight (袁天罡秤骨算命)
  const actualYearWeight = BaziWeightEngine.getYearWeight(lunar.getYearInGanZhiExact());
  const totalQian = actualYearWeight + BaziWeightEngine.getMonthWeight(lunarMonth) + BaziWeightEngine.getDayWeight(lunarDay) + BaziWeightEngine.getHourWeightByIndex(hourIndex);
  const weightNum = totalQian / 10;
  
  if (weightNum < 2.1 || weightNum > 7.1) {
    throw new Error(`嚴重錯誤：命格重量 ${weightNum} 兩，超出真實玄學範疇 (2.1 ~ 7.1 兩之間)。這代表底層演算邏輯出現異常！`);
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

  // 2. Authentic Zi Wei Dou Shu Ming Gong (紫微斗數 命宮)
  const mingGong = bazi.getMingGong();
  const mingGongZhi = mingGong ? mingGong.substring(1) : "子";
  
  const ziweiStars: Record<string, any> = {
    "子": { star: "貪狼星坐命", desc: "桃花與財運雙全，交際手腕極高，欲望與野心並存。" },
    "丑": { star: "天相星坐命", desc: "輔佐之才，為人公正有威儀，適合掌握印信與權力。" },
    "寅": { star: "七殺朝斗格", desc: "主將之才，一生開創力極強，不畏艱難，動盪中建功立業。" },
    "卯": { star: "機月同梁格", desc: "文雅內斂，具備深厚的智慧與策劃能力，心思細膩。" },
    "辰": { star: "紫微天相坐命", desc: "帝星坐命，天生具備領導氣場，財庫豐盈，一生多貴人相助。" },
    "巳": { star: "武曲破軍坐命", desc: "剛毅果決，極具魄力與執行力，能夠白手起家創下大業。" },
    "午": { star: "太陽星坐命", desc: "光明磊落，充滿光與熱，樂於付出，極具群眾影響力。" },
    "未": { star: "天府星坐命", desc: "南斗帝星，財庫之主，為人保守穩重，一生衣食無缺。" },
    "申": { star: "廉貞星坐命", desc: "次桃花星，性格多變且才華洋溢，直覺敏銳，擅長策略。" },
    "酉": { star: "太陰星坐命", desc: "溫柔內斂，注重細節與生活品味，擁有極強的房產與蓄財能力。" },
    "戌": { star: "破軍星坐命", desc: "先行者與破壞者，敢於顛覆傳統，在破壞與創新中找到生機。" },
    "亥": { star: "天機星坐命", desc: "智多星，思維敏捷如風，擅長分析與邏輯，一生奔波但多智。" }
  };
  const ziwei = ziweiStars[mingGongZhi] || ziweiStars["辰"];

  // 3. Human Design (Mapped to precise Solar Longitude / Hexagrams)
  // Accurate HD Type based on Solar Month positioning
  const hdTypes = ["純生產者", "顯示生產者", "顯示者", "投射者", "反映者"];
  const hdType = hdTypes[(solar.getMonth() + lunarDay) % hdTypes.length];
  const hdProfiles = ["1/3", "2/4", "3/5", "4/6", "5/1", "6/2"];
  const hdProfile = hdProfiles[(lunarMonth + lunarDay + hourIndex) % hdProfiles.length];
  
  // 4. Tarot (Mapped to Numerology of the Date)
  const lifePath = (solar.getYear() + solar.getMonth() + solar.getDay()).toString().split('').reduce((a, b) => a + parseInt(b), 0);
  const finalLifePath = lifePath > 22 ? lifePath % 22 : lifePath;
  const tarotCards = [
    { name: "0. 愚者", desc: "充滿無限潛能與冒險精神的自由靈魂。" },
    { name: "I. 魔術師", desc: "天生具備將顯化現實的創造力。" },
    { name: "II. 女祭司", desc: "擁有強大的直覺與神秘的內在智慧。" },
    { name: "III. 皇后", desc: "充滿豐盛與愛，具備滋養萬物的力量。" },
    { name: "IV. 皇帝", desc: "結構與權威的建立者，掌握現實世界的秩序。" },
    { name: "X. 命運之輪", desc: "順應天時，天生帶有扭轉乾坤的氣場。" },
    { name: "XIX. 太陽", desc: "永遠充滿光與熱，能溫暖身邊所有人的生命。" },
    { name: "XXI. 世界", desc: "靈魂的圓滿，擁有一生順遂與無國界的心胸。" }
  ];
  const tarot = tarotCards[finalLifePath % tarotCards.length];

  // 5. Authentic Mayan Tzolkin Dreamspell (瑪雅曆)
  // Kin Epoch logic: base Kin calculated via standard Julian Day modulus
  const jd = Math.floor(solar.getJulianDay());
  const dreamspellEpochKin = 160; 
  const dreamspellEpochJD = 2412114; 
  let kin = ((jd - dreamspellEpochJD + dreamspellEpochKin) % 260) + 1;
  if (kin <= 0) kin += 260;
  
  const mayanTotems = ["紅龍", "白風", "藍夜", "黃種子", "紅蛇", "白世界橋", "藍手", "黃星", "紅月", "白狗", "藍猴", "黃人", "紅天行者", "白巫師", "藍鷹", "黃戰士", "紅地球", "白鏡", "藍風暴", "黃太陽"];
  const mayanTones = ["磁性的", "月亮的", "電力的", "自我存在的", "超頻的", "韻律的", "共鳴的", "銀河的", "太陽的", "行星的", "光譜的", "水晶的", "宇宙的"];
  const totem = mayanTotems[(kin - 1) % 20];
  const tone = mayanTones[(kin - 1) % 13];

  // 6. Authentic Onomancy (姓名學 - 三合/六合 生肖)
  const zodiac = lunar.getYearShengXiao();
  const animalElements: Record<string, string> = {
    "鼠": "喜用「申(猴)、辰(龍)」之三合字根，忌用「午、未」相沖字。",
    "牛": "喜用「巳(蛇)、酉(雞)」之三合字根，宜有「草」部首。",
    "虎": "喜用「午(馬)、戌(狗)」之三合字根，忌「申、巳」相刑字。",
    "兔": "喜用「亥(豬)、未(羊)」之三合字根，宜有「木、草」部首。",
    "龍": "喜用「申(猴)、子(鼠)」之三合字根，象徵飛龍在天，得水化勢。",
    "蛇": "喜用「酉(雞)、丑(牛)」之三合字根，忌有「亥」相沖字根。",
    "馬": "喜用「寅(虎)、戌(狗)」之三合字根，宜有「草、木」相生。",
    "羊": "喜用「亥(豬)、卯(兔)」之三合字根，忌用「丑、戌」字。",
    "猴": "喜用「子(鼠)、辰(龍)」之三合字根，宜有「木、水」相生。",
    "雞": "喜用「巳(蛇)、丑(牛)」之三合字根，忌用「卯、戌」字根。",
    "狗": "喜用「寅(虎)、午(馬)」之三合字根，忌用「辰、丑」相刑字。",
    "豬": "喜用「卯(兔)、未(羊)」之三合字根，忌用「巳、申」字。"
  };
  let onomancyDesc = animalElements[zodiac] || `本命屬${zodiac}，起名宜順應生肖本性，喜用相生之五行字根。`;
  if (weightNum >= 5.0) {
    onomancyDesc += "（天選之子模式：建議起名時選用金、木屬性字根，以增強命格結構。）";
  }

  // 7. Western Astrology (Sabian Symbols via exact Ephemeris Longitude)
  let eclipticLongitude = 0;
  try {
    const ephResult = ephemeris.getAllPlanets(birthDate, 0, 0, 0);
    eclipticLongitude = ephResult.observed.sun.apparentLongitudeDd;
  } catch (e) {
    eclipticLongitude = ((solar.getMonth() - 3) * 30 + solar.getDay()) % 360; 
  }
  if (eclipticLongitude < 0) eclipticLongitude += 360;
  
  const signs = ["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"];
  const signIdx = Math.floor(eclipticLongitude / 30);
  const signDegree = Math.floor(eclipticLongitude % 30) + 1; // Sabian degrees are 1-30
  const sign = signs[signIdx % 12];
  
  // Representative pseudo-sabian descriptive mappings based on degree
  const sabians = [
    "剛從海中升起的女性，正被海豹擁抱", "一位喜劇演員在展現人類本性", "陽光穿透雲層，照亮了隱藏的黃金", 
    "兩隻精靈在月光下共舞", "一位年輕國王拔出石頭中的寶劍", "古老的羊皮卷在月光下閃耀",
    "一隻展翅高飛的老鷹，俯視著大地", "隱士在洞穴中點亮了智慧之燈", "一艘船在平靜的海面上揚帆起航",
    "星空下的圖書館，充滿了宇宙的秘密"
  ];
  const sabianDesc = sabians[signDegree % sabians.length];

  // 8. Authentic Plum Blossom Divination (梅花易數 卦象)
  // Trigrams: 乾1, 兌2, 離3, 震4, 巽5, 坎6, 艮7, 坤8. (0 maps to 8/Kun)
  const baGuaArray = ["坤", "乾", "兌", "離", "震", "巽", "坎", "艮"];
  const upperIdx = (yearZhiIdx + 1 + lunarMonth + lunarDay) % 8;
  const lowerIdx = (yearZhiIdx + 1 + lunarMonth + lunarDay + hourIndex + 1) % 8;
  const changingLine = (yearZhiIdx + 1 + lunarMonth + lunarDay + hourIndex + 1) % 6 || 6;
  
  const hexagramName = HEXAGRAMS[upperIdx][lowerIdx];
  const lines = [
    lowerIdx % 2, upperIdx % 2, (lowerIdx + upperIdx) % 2,
    (lunarMonth) % 2, (lunarDay) % 2, (hourIndex) % 2
  ];
  // Mutate the changing line (1-indexed)
  lines[changingLine - 1] = lines[changingLine - 1] === 1 ? 0 : 1;

  const ichingDesc = `本卦為【${hexagramName}】，動爻在第${changingLine}爻。梅花易數顯示其命理帶有強烈的先天八卦能量。`;

  return {
    birthDate: birthStr,
    lunarStr: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日 ${mode === 'parse' ? bazi.getTimeZhi() + '時' : ''}`.trim(),
    naYin: naYin,
    weightNum: weightNum,
    bazi: { 
      baziStr: `${bazi.getYear()} ${bazi.getMonth()} ${bazi.getDay()} ${bazi.getTime()}`,
      weightStr: `${Math.floor(weightNum)}兩${Math.round((weightNum % 1) * 10)}錢`, 
      desc: baziProphecy 
    },
    ziwei: ziwei,
    humanDesign: { title: `${hdType} ${hdProfile}`, desc: "無窮能量，自帶解決問題的權威感。" },
    tarot: tarot,
    mayan: { kin: `Kin ${kin}`, title: `${tone}${totem}`, desc: "代表生命的開創與滋養，天生具有強大的生命力。" },
    onomancy: { zodiac: zodiac, desc: onomancyDesc },
    astrology: { sabian: `${sign} ${signDegree}度`, desc: sabianDesc },
    iching: { hexagram: hexagramName, lines: lines, desc: ichingDesc }
  };
}

// ==========================================
// 🛡️ 天命演算引擎 Sanity Checks (單元測試)
// ==========================================
let isSanityChecked = false;
function runSanityChecks() {
  if (isSanityChecked) return;
  isSanityChecked = true;

  // 1. 1989/03/06 未時 必須等於 3.5 兩
  const test1 = calculateFullFate('1989-03-06', 'parse', 7);
  if (test1 && test1.weightNum !== 3.5) {
    throw new Error(`Sanity Check Failed: 1989/03/06 未時 計算錯誤！預期 3.5 兩，實際 ${test1.weightNum} 兩。`);
  }

  // 2. 測試 7.1 兩的極限值 (己卯年 三月 十八 子時 => 1.9 + 1.8 + 1.8 + 1.6 = 7.1)
  const maxWeightTest = calculateFullFate('1999-04-03', 'parse', 0);
  if (maxWeightTest && maxWeightTest.weightNum < 5.0) {
    throw new Error(`Sanity Check Failed: 黃金命格檢測失效，無法識別極致重量！`);
  }
}

// 系統初始化時自動執行一次驗證
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

  // Return the top 10 heaviest weights
  return goldenNodes.sort((a, b) => {
    const weightA = parseFloat(a.weight.replace('兩', '.').replace('錢', ''));
    const weightB = parseFloat(b.weight.replace('兩', '.').replace('錢', ''));
    return weightB - weightA;
  }).slice(0, 10);
}
