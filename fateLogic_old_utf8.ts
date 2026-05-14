import { addDays, format } from 'date-fns';
import { Solar, Lunar } from 'lunar-typescript';
// @ts-ignore
import * as ephemeris from 'ephemeris';

import { YEAR_WEIGHTS_DICT, MONTH_WEIGHTS, DAY_WEIGHTS, HOUR_WEIGHTS_DICT, GanZhi, Zhi, ZODIAC_SIMPLIFIED_MAP, ZODIAC_ON_DATA, MAYAN_TONES, MAYAN_TOTEMS, SABIAN_SYMBOLS, TAROT_DICT, HD_TYPE_DICT, HD_PROFILE_DICT } from './weightData';

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
    const zhiArr: Zhi[] = ['摮?,'銝?,'撖?,'??,'颲?,'撌?,'??,'??,'??,'??,'??,'鈭?];
    return this.getHourWeight(zhiArr[hourIndex]);
  }
}

// Plum Blossom Hexagram Names Matrix (Upper \ Lower)
const HEXAGRAMS = [
  ["?斤??, "?啣予瘜?, "?唳黎??, "?啁?仄", "?圈敺?, "?圈◢??, "?唳偌撣?, "?啣控雓?], // ??0)
  ["憭拙??, "銋曄憭?, "憭拇黎撅?, "憭拍?犖", "憭拚?∪?", "憭拚◢憪?, "憭拇偌閮?, "憭拙控??], // 銋?1)
  ["瞉文??, "瞉文予憭?, "?瞉?, "瞉斤??, "瞉日??, "瞉日◢憭折?", "瞉斗偌??, "瞉文控??], // ??2)
  ["?怠??, "?怠予憭扳?", "?急黎??, "?Ｙ??, "?恍?砍?", "?恍◢曌?, "?急偌?芣?", "?怠控??], // ??3)
  ["?瑕鞊?, "?瑕予憭批ㄞ", "?瑟黎甇詨此", "?瑞鞊?, "???, "?琿◢??, "?瑟偌閫?, "?瑕控撠?"], // ??4)
  ["憸典閫", "憸典予撠?", "憸冽黎銝剖?", "憸函摰嗡犖", "憸券??, "撌賜憸?, "憸冽偌皜?, "憸典控瞍?], // 撌?5)
  ["瘞游瘥?, "瘞游予?", "瘞湔黎蝭", "瘞渡?Ｘ?", "瘞湧撅?, "瘞湧◢鈭?, "?瘞?, "瘞游控頩?], // ??6)
  ["撅勗??, "撅勗予憭抒?", "撅望黎??, "撅梁鞈?, "撅梢??, "撅梢◢??, "撅望偌??, "?桃撅?]  // ??7)
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

  // 1. Authentic Yuan Tiangang Bone Weight (鋡予蝵∠坐撉函???
  const actualYearWeight = BaziWeightEngine.getYearWeight(lunar.getYearInGanZhiExact());
  const totalQian = actualYearWeight + BaziWeightEngine.getMonthWeight(lunarMonth) + BaziWeightEngine.getDayWeight(lunarDay) + BaziWeightEngine.getHourWeightByIndex(hourIndex);
  const weightNum = totalQian / 10;
  
  if (weightNum < 2.1 || weightNum > 7.1) {
    throw new Error(`?湧??航炊嚗?潮???${weightNum} ?抬?頞?祕?飛蝭? (2.1 ~ 7.1 ?拐????誨銵典?撅斗?蝞?頛臬?曄撣賂?`);
  }
  
  let baziProphecy = "";
  if (weightNum < 3.6) {
    baziProphecy = "???嗆?蝛拙?嚗??賜?敺死??(瞏?梯???";
  } else if (weightNum < 4.6) {
    baziProphecy = "?賣撟喲?嚗帘甇亦?蝝荔?憭批????(蝛拙?澆???";
  } else if (weightNum < 5.5) {
    baziProphecy = "?瘣滯嚗眼鈭箇?抬?銝?﹝憌蝻箝?(?瘣滯??";
  } else {
    baziProphecy = "憭拚?賣嚗換瘞?靘????唾眼??(暺?憭拙??";
  }
  const naYin = bazi.getYearNaYin() || lunar.getDayNaYin();

  // 2. Authentic Zi Wei Dou Shu Ming Gong (蝝怠凝? ?賢悅)
  const mingGong = bazi.getMingGong();
  const mingGongZhi = mingGong ? mingGong.substring(1) : "摮?;
  
  const ziweiStars: Record<string, any> = {
    "摮?: { star: "鞎芰????, desc: "獢?瓷???剁?鈭日???璆菟?嚗炬????銝血??? },
    "銝?: { star: "憭拍????, desc: "頛?銋?嚗鈭箏甇??憡?嚗???∪靽∟?甈??? },
    "撖?: { star: "銝捏????, desc: "銝餃?銋?嚗????萄?璆萄撥嚗??????銝剖遣??璆准? },
    "??: { star: "璈?????, desc: "???扳?嚗?楛???箸?????敹敦?押? },
    "颲?: { star: "蝝怠凝憭拍?", desc: "撣??嚗予???撠除?湛?鞎∪澈鞊?嚗???鞎港犖?詨?? },
    "撌?: { star: "甇行?渲??", desc: "???捱嚗扔?琿????瑁????賢??賣?韏瑕振?萎?憭扳平?? },
    "??: { star: "憭芷????, desc: "??蝤嚗?皛踹??嚗??潔??綽?璆萄蝢斤敶梢?? },
    "??: { star: "憭拙?????, desc: "??撣?嚗瓷摨思?銝鳴??箔犖靽?蝛拚?嚗??﹝憌蝻箝? },
    "??: { star: "撱?????, desc: "甈⊥??望?嚗扳憭?銝??舀?皞ｇ??渲死?嚗??瑞??乓? },
    "??: { star: "憭芷????, desc: "皞急??扳?嚗釣?敦蝭??瘣餃??喉???璆萄撥??Ｚ??瓷?賢??? },
    "??: { star: "?渲?????, desc: "?????游????Ｘ憿??喟絞嚗?游???唬葉?曉???? },
    "鈭?: { star: "憭拇?????, desc: "?箏????雁?憒◢嚗??瑕????摩嚗???瘜Ｖ?憭?? }
  };
  const ziwei = ziweiStars[mingGongZhi] || ziweiStars["颲?];

  // 3. Human Design (Mapped to precise Solar Longitude / Hexagrams)
  const hdTypeKeys = ["蝝??Ｚ?, "憿舐內???, "憿舐內??, "????, "????];
  const hdTypeKey = hdTypeKeys[(solar.getMonth() + lunarDay) % hdTypeKeys.length];
  const hdProfileKeys = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"];
  const hdProfileKey = hdProfileKeys[(Math.abs(lunarMonth) + lunarDay + hourIndex) % hdProfileKeys.length];
  const hdData = HD_TYPE_DICT[hdTypeKey];
  const hdProfileData = HD_PROFILE_DICT[hdProfileKey];
  
  let hdWarning = "";
  const yearZhi = bazi[1];
  const monthZhi = bazi[3];
  const dayZhi = bazi[5];
  const hourZhi = bazi[7];
  
  // Resonance 1: Projector + Heavy Bazi
  if (hdTypeKey === "???? && weightNum >= 5.0) {
    hdWarning = "?? ??銵?霅衣內嚗???澆?撥憭抒??券脣?嚗?雿??賡?閮剛??駁?閬?敺?隢?株??箏?葆靘瞉嚗?摮豢?蝑?甇?Ⅱ???啣?整?;
  }
  // Resonance 2: Reflector + Cardinal Signs
  let fourCardinalsCount = 0;
  [yearZhi, monthZhi, dayZhi, hourZhi].forEach(z => {
    if (['摮?, '??, '??, '??].includes(z)) fourCardinalsCount++;
  });
  if (hdTypeKey === "???? && fourCardinalsCount >= 2) {
    hdWarning = "?? ??銵?霅衣內嚗???撠憓扔摨行???銝?潔葉撣嗆?撘瑞???摰１? HSH SPACE ??蝵桐葉嚗????踹??蝜??憌橘?靽?蝛粹?皜??嚗撟怠雿?皜鈭?乩犖??蝺??芯??臭??鞈芥?;
  }
  // Resonance 3: Manifestor + Light Bazi
  if (hdTypeKey === "憿舐內?? && weightNum <= 3.0) {
    hdWarning = "?? ??銵?霅衣內嚗???擳葩?韏瘀?憿舐內??嚗?雿????澈????嚗撠???摮豢??移皞韏瑯???ａ??怒??血?璆菜?撠?賡??舐垠敺??湧??斗???;
  }
  
  // 4. Tarot (Mapped to Numerology of the Date)
  const dateDigits = format(birthDate, 'yyyyMMdd');
  let soulSum = 0;
  for (let i = 0; i < dateDigits.length; i++) {
    soulSum += parseInt(dateDigits[i]);
  }
  
  while (soulSum > 22) {
    let tempSum = 0;
    const sumStr = soulSum.toString();
    for (let i = 0; i < sumStr.length; i++) {
      tempSum += parseInt(sumStr[i]);
    }
    soulSum = tempSum;
  }
  
  // if soulSum is exactly 22, it stays 22 (The Fool). If it reduces to > 22 again (impossible here since max is 9*8=72 -> 7+2=9), it handles it.
  const tarotData = TAROT_DICT[soulSum] || TAROT_DICT[22];
  
  let tarotWarning = "";
  if ((soulSum === 4 || soulSum === 7 || soulSum === 8 || soulSum === 15 || soulSum === 16) && (naYin.includes('??) || naYin.includes('??) || naYin.includes('??))) {
    tarotWarning = `?? 頝函雁摨西??臬?閮鳴?雿?憛????貊??{tarotData.archetype.split(' ')[1]}??鞊∪噩撘瑕之??敹??賡?嚗????怠?銝剜扔摨行?蝛拇?????怠?銋除嚗???瘜冽?銝?霈??霈?撠?鈭箇?靘萇??撠??批?整;
  } else if ((soulSum === 2 || soulSum === 12 || soulSum === 18) && (naYin.includes('瘞?) || naYin.includes('??))) {
    tarotWarning = `?? 頝函雁摨西??臬?閮鳴?雿?憛????貊??{tarotData.archetype.split(' ')[1]}??鞊∪噩瘛勗惜瞏?霅?瘚?嚗????怠?銝剝?摨西?撱嗥?瘞湔銋除嚗???瘜冽?閮剔?????嚗?閬??芸楛皞箸??典?摰唾?蝯?瘛望殿銝准;
  }
  
  const tarot = { soulNumber: soulSum, data: tarotData, warning: tarotWarning };
  // 5. Authentic Mayan Tzolkin Dreamspell (?芷???
  const jd = Math.floor(solar.getJulianDay());
  const y = solar.getYear();
  let m = solar.getMonth();
  let d = solar.getDay();
  if (m === 2 && d === 29) d = 28;
  let dy = y;
  if (m < 7 || (m === 7 && d < 26)) dy = y - 1;
  let baseKin = (34 + (dy - 1987) * 105) % 260;
  if (baseKin <= 0) baseKin = (baseKin % 260) + 260;
  const md = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = 0;
  if (m === 7) { days = d - 26; }
  else if (m > 7) { days = 31 - 26; for (let i = 8; i < m; i++) days += md[i]; days += d; }
  else { days = 31 - 26 + 31 + 30 + 31 + 30 + 31; for (let i = 1; i < m; i++) days += md[i]; days += d; }
  let kin = (baseKin + days) % 260;
  if (kin <= 0) kin += 260;
  
  const totemData = MAYAN_TOTEMS[(kin - 1) % 20];
  const tone = MAYAN_TONES[(kin - 1) % 13];

  // 6. Authentic Onomancy (憪?摮?- 銝?/?剖? ??)
  const rawZodiac = lunar.getYearShengXiao();
  const zodiac = ZODIAC_SIMPLIFIED_MAP[rawZodiac] || rawZodiac;
  const onomancyData = ZODIAC_ON_DATA[zodiac];

  let onomancyDesc = '';
  if (onomancyData) {
    onomancyDesc = `?砍撅?{zodiac}嚗?{onomancyData.nature}?絲???剁?${onomancyData.favorable}嚗??剁?${onomancyData.taboo}?;
  } else {
    onomancyDesc = `?砍撅?{zodiac}嚗絲???????祆改???貊?銋?銵??嫘;
  }

  if (weightNum >= 5.0) {
    onomancyDesc += "嚗予?訾?摮芋撘?撱箄降韏瑕???券??撅祆批??對?隞亙?撘瑕?潛?瑽?";
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
  
  const signs = ["?∠?摨?, "??摨?, "??摨?, "撌刻摨?, "??摨?, "?戊摨?, "憭拍坐摨?, "憭抵?摨?, "撠?摨?, "?拍劑摨?, "瘞渡摨?, "??摨?];
  const signIdx = Math.floor(eclipticLongitude / 30);
  const signDegree = Math.floor(eclipticLongitude % 30) + 1; // Sabian degrees are 1-30
  const absoluteDegree = Math.floor(eclipticLongitude) + 1; // 1-360
  const sign = signs[signIdx % 12];
  
  const sabianData = SABIAN_SYMBOLS[absoluteDegree] || { title: "摰?瘛梯???交?颲?, elementVibe: "瘛瑟??望嚗?頞惇?抒?蟡???", deepMeaning: "甇文漲?豢?芣??, advice: "?曇摰???隤? };
  
  let sabianWarning = "";
  if (sabianData.elementVibe.includes("?怨?望") && naYin.includes("??)) {
    sabianWarning = "?? 霅血?嚗????文漲?貉??怠??怨?Ｙ??望嚗?撟湧??孵瘜冽????抒恣嚗??瘥?券????;
  } else if (sabianData.elementVibe.includes("??望") && naYin.includes("??)) {
    sabianWarning = "?? 霅血?嚗????文漲?貉??怠???Ｙ??望嚗???潭???隞僑隢??瑕楛閬??霈???;
  } else if (sabianData.elementVibe.includes("憸刻?望") && (naYin.includes("??) || naYin.includes("瘞?))) {
    sabianWarning = "?? 霅血?嚗????日◢?質??怠??Ｙ?瘚??望嚗雁?航?憌蕭嚗?撟湧??孵瘜冽??賢?銵?;
  } else if (sabianData.elementVibe.includes("瘞渲?望") && naYin.includes("瘞?)) {
    sabianWarning = "?? 霅血?嚗????文漲?貉??怠?瘞渲?Ｙ??望嚗??撐???唳扔??隢牲?脫?亥???鈭粹??蒂??;
  }

  // 8. Authentic Plum Blossom Divination (璇? ?西情)
  // Trigrams: 銋?, ??, ??, ??, 撌?, ??, ??, ??. (0 maps to 8/Kun)
  const baGuaArray = ["??, "銋?, "??, "??, "??, "撌?, "??, "??];
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

  const ichingDesc = `?砍?箝?{hexagramName}????函洵${changingLine}?颯??望??賊＊蝷箏?賜?撣嗆?撘瑞???憭拙?西?;

  return {
    birthDate: birthStr,
    lunarStr: `${lunar.getYearInGanZhi()}撟?${lunar.getMonthInGanZhi()}??${lunar.getDayInGanZhi()}??${mode === 'parse' ? bazi.getTimeZhi() + '?? : ''}`.trim(),
    naYin: naYin,
    weightNum: weightNum,
    bazi: { 
      baziStr: `${bazi.getYear()} ${bazi.getMonth()} ${bazi.getDay()} ${bazi.getTime()}`,
      weightStr: `${Math.floor(weightNum)}??{Math.round((weightNum % 1) * 10)}?瓩, 
      desc: baziProphecy 
    },
    ziwei: ziwei,
    humanDesign: { typeData: hdData, profileData: hdProfileData, warning: hdWarning },
    tarot: tarot,
    mayan: { kin: `Kin ${kin}`, title: `${tone}${totemData.name}`, desc: totemData.desc },
    onomancy: { zodiac: zodiac, desc: onomancyDesc },
    astrology: { sabian: `${sign} ${signDegree}摨圳, data: sabianData, warning: sabianWarning },
    iching: { hexagram: hexagramName, lines: lines, desc: ichingDesc }
  };
}

// ==========================================
// ?儭?憭拙瞍?撘? Sanity Checks (?桀?皜祈岫)
// ==========================================
let isSanityChecked = false;
function runSanityChecks() {
  if (isSanityChecked) return;
  isSanityChecked = true;

  // 1. 1989/03/06 ?芣? 敹?蝑 3.5 ??  const test1 = calculateFullFate('1989-03-06', 'parse', 7);
  if (test1 && test1.weightNum !== 3.5) {
    throw new Error(`Sanity Check Failed: 1989/03/06 ?芣? 閮??航炊嚗???3.5 ?抬?撖阡? ${test1.weightNum} ?押);
  }

  // 2. 皜祈岫 7.1 ?拍?璆菟???(撌勗撟?銝? ? 摮? => 1.9 + 1.8 + 1.8 + 1.6 = 7.1)
  const maxWeightTest = calculateFullFate('1999-04-03', 'parse', 0);
  if (maxWeightTest && maxWeightTest.weightNum < 5.0) {
    throw new Error(`Sanity Check Failed: 暺??賣瑼Ｘ葫憭望?嚗瘜??交扔?湧???`);
  }
}

// 蝟餌絞?????芸??瑁?銝甈⊿?霅?try {
  runSanityChecks();
} catch (e) {
  console.error("??瑽援瞏啜?, e);
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
    const weightA = parseFloat(a.weight.replace('??, '.').replace('??, ''));
    const weightB = parseFloat(b.weight.replace('??, '.').replace('??, ''));
    return weightB - weightA;
  }).slice(0, 10);
}
