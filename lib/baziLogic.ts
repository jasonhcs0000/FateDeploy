/**
 * baziLogic.ts — 八字五行格局科學引擎
 * 月令加權 + 天透地藏 + 十神演算 + 格局診斷 + 能量處方箋
 */

// ============================================================
// 1. 基礎屬性表
// ============================================================

export const GAN_ELEMENT: Record<string, string> = {
  甲:'木', 乙:'木', 丙:'火', 丁:'火', 戊:'土',
  己:'土', 庚:'金', 辛:'金', 壬:'水', 癸:'水'
};

export const ZHI_ELEMENT: Record<string, string> = {
  子:'水', 丑:'土', 寅:'木', 卯:'木', 辰:'土', 巳:'火',
  午:'火', 未:'土', 申:'金', 酉:'金', 戌:'土', 亥:'水'
};

const GAN_YIN: Record<string, boolean> = {
  甲:false, 乙:true, 丙:false, 丁:true, 戊:false,
  己:true, 庚:false, 辛:true, 壬:false, 癸:true
};

// 生剋循環
const GENERATES: Record<string, string> = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
const CONTROLS:  Record<string, string> = { 木:'土', 土:'水', 水:'火', 火:'金', 金:'木' };

// ============================================================
// 旺相休囚死 — 五行氣象引擎
// ============================================================

export type ElementStatus = '旺' | '相' | '休' | '囚' | '死';

// 月支 → 當令五行（月令）
const MONTH_ZHI_RULER: Record<string, string> = {
  寅:'木', 卯:'木',
  巳:'火', 午:'火',
  辰:'土', 戌:'土', 丑:'土', 未:'土',
  申:'金', 酉:'金',
  亥:'水', 子:'水',
};

// 旺相休囚死對照表
// key = 當令之元素，value = 各五行的狀態
// 規則：
//   旺 = 當令者本身
//   相 = 旺者所生者（子當令，父輔佐）
//   休 = 生旺者者（功成身退之父母）
//   囚 = 剋旺者者（剋不動當令，身陷囹圄）
//   死 = 旺者所剋者（被踩在腳下，毫無生氣）
const STATUS_TABLE: Record<string, Record<string, ElementStatus>> = {
  木: { 木:'旺', 火:'相', 水:'休', 金:'囚', 土:'死' },
  火: { 火:'旺', 土:'相', 木:'休', 水:'囚', 金:'死' },
  土: { 土:'旺', 金:'相', 火:'休', 木:'囚', 水:'死' },
  金: { 金:'旺', 水:'相', 土:'休', 火:'囚', 木:'死' },
  水: { 水:'旺', 木:'相', 金:'休', 土:'囚', 火:'死' },
};

/** 古法短評：五種氣象狀態的「老祖宗診斷語」 */
export const STATUS_FLAVOR: Record<ElementStatus, { label: string; desc: string; glow: boolean }> = {
  旺: { label: '旺', desc: '秉權當令，氣勢磅礡，為命局核心。此氣正值盛時，萬象以之為主。', glow: true  },
  相: { label: '相', desc: '次旺之氣，生助有情，輔佐主事。如股肱之臣，得力而稱職。',   glow: false },
  休: { label: '休', desc: '功成身退，能量收斂，宜靜不宜動。如父母已養育子女，此時安享清福。', glow: false },
  囚: { label: '囚', desc: '氣息受阻，施展不開，力量被當令之氣壓制。如囚犯，雖有力量，難以發揮。', glow: false },
  死: { label: '死', desc: '氣息全無，衰敗之極，被當令之氣徹底剋制。此時補救最為迫切。',   glow: false },
};

/**
 * 取得某五行在特定月令下的「旺相休囚死」狀態
 * @param element 要判斷的五行（木火土金水）
 * @param monthZhi 月支（如卯、午、申等）
 */
export function getFiveElementStatus(element: string, monthZhi: string): ElementStatus {
  const ruler = MONTH_ZHI_RULER[monthZhi];
  if (!ruler) return '休'; // 未知月支，保守返回休
  return STATUS_TABLE[ruler]?.[element] ?? '休';
}

// ============================================================
// 2. 十神演算
// ============================================================

export type TenGod =
  | '比肩' | '劫財'
  | '食神' | '傷官'
  | '正財' | '偏財'
  | '正官' | '七殺'
  | '正印' | '偏印';

function getTenGod(dmGan: string, targetChar: string, isStem: boolean): TenGod | null {
  const dmEl = GAN_ELEMENT[dmGan];
  const dmYin = GAN_YIN[dmGan];
  if (!dmEl) return null;

  const tEl = isStem ? GAN_ELEMENT[targetChar] : ZHI_ELEMENT[targetChar];
  const tYin = isStem ? GAN_YIN[targetChar] : undefined;
  if (!tEl) return null;

  const sameYin = isStem ? (tYin === dmYin) : (dmYin === false); // 地支預設陽

  if (tEl === dmEl)             return sameYin ? '比肩' : '劫財';
  if (GENERATES[dmEl] === tEl)  return sameYin ? '傷官' : '食神';
  if (GENERATES[tEl] === dmEl)  return sameYin ? '偏印' : '正印';
  if (CONTROLS[dmEl] === tEl)   return sameYin ? '偏財' : '正財';
  if (CONTROLS[tEl] === dmEl)   return sameYin ? '七殺' : '正官';
  return null;
}

// ============================================================
// 3. 五行計分引擎
// ============================================================

export interface BaziMatrix {
  dayMaster: string;
  dayMasterElement: string;
  monthZhi: string;                          // 月支（判定旺相休囚死的基準）
  elements: Record<string, number>;          // 百分比 0-100
  elementStatus: Record<string, ElementStatus>; // 旺相休囚死狀態
  rawScores: Record<string, number>;
  strength: 'strong' | 'weak' | 'neutral';
  strengthScore: number;
  tenGods: Array<{ char: string; god: TenGod | null; pillar: string }>;
  tenGodSummary: Partial<Record<TenGod, number>>;
  pattern: string;
  patternDesc: string;
  patternAdvice: string;
  prescription: { weak: string; strong: string; weakElement: string; strongElement: string };
  debugLog: string[];
}

const ELEMENT_COLORS: Record<string, string> = {
  木: '#4ade80', 火: '#f97316', 土: '#f59e0b', 金: '#94a3b8', 水: '#22d3ee'
};

export { ELEMENT_COLORS };

// 月令加分倍率（月支是命盤的核心）
const MONTH_ZHI_MULTIPLIER = 2.8; // 相當於 40% 佔比
const GAN_WEIGHT   = 1.2;         // 天干透出，能量外顯
const ZHI_WEIGHT   = 1.0;         // 地支深藏

export function analyzeBazi(
  yearPillar: string,
  monthPillar: string,
  dayPillar: string,
  hourPillar: string,
  log: string[] = []
): BaziMatrix {

  // 拆解八字
  const pillars = [
    { label: '年干', char: yearPillar[0],  isStem: true,  isMonthZhi: false },
    { label: '年支', char: yearPillar[1],  isStem: false, isMonthZhi: false },
    { label: '月干', char: monthPillar[0], isStem: true,  isMonthZhi: false },
    { label: '月支', char: monthPillar[1], isStem: false, isMonthZhi: true  },
    { label: '日干', char: dayPillar[0],   isStem: true,  isMonthZhi: false },
    { label: '日支', char: dayPillar[1],   isStem: false, isMonthZhi: false },
    { label: '時干', char: hourPillar[0],  isStem: true,  isMonthZhi: false },
    { label: '時支', char: hourPillar[1],  isStem: false, isMonthZhi: false },
  ];

  const dayMasterGan = dayPillar[0];
  const dayMasterElement = GAN_ELEMENT[dayMasterGan] || '土';
  const monthZhi = monthPillar[1]; // 月支，旺相休囚死的基準

  // 計算旺相休囚死
  const ELEMENTS = ['木','火','土','金','水'];
  const elementStatus: Record<string, ElementStatus> = {};
  for (const el of ELEMENTS) {
    elementStatus[el] = getFiveElementStatus(el, monthZhi);
  }
  log.push(`月令「${monthZhi}」氣象：${ELEMENTS.map(el => `${el}【${elementStatus[el]}】`).join(' ')}`);

  // 計算原始分數
  const rawScores: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 };

  for (const p of pillars) {
    const el = p.isStem ? GAN_ELEMENT[p.char] : ZHI_ELEMENT[p.char];
    if (!el || !rawScores.hasOwnProperty(el)) continue;

    let weight = p.isStem ? GAN_WEIGHT : ZHI_WEIGHT;
    if (p.isMonthZhi) weight *= MONTH_ZHI_MULTIPLIER;

    rawScores[el] += weight;
    log.push(`${p.label}「${p.char}」→ ${el} +${weight.toFixed(2)}`);
  }

  const totalRaw = Object.values(rawScores).reduce((a, b) => a + b, 0);
  const elements: Record<string, number> = {};
  for (const [k, v] of Object.entries(rawScores)) {
    elements[k] = totalRaw > 0 ? parseFloat(((v / totalRaw) * 100).toFixed(1)) : 20;
  }

  // 身強身弱判定
  const selfStrengthGroup = ['比肩','劫財','正印','偏印'];
  const drainGroup        = ['食神','傷官','正財','偏財','正官','七殺'];

  // 生我 + 同我 vs 耗我 + 剋我
  const selfEl = dayMasterElement;
  const generatesMe = Object.keys(GENERATES).find(k => GENERATES[k] === selfEl) || '';
  const strengthScore =
    (elements[selfEl] || 0) + (elements[generatesMe] || 0);
  const drainScore = 100 - strengthScore;

  const strength: 'strong' | 'weak' | 'neutral' =
    strengthScore > 55 ? 'strong' : strengthScore < 45 ? 'weak' : 'neutral';

  log.push(`日主「${dayMasterGan}」屬${selfEl}，身強組${strengthScore.toFixed(1)}% → ${strength}`);

  // 十神計算（跳過日干自身）
  const tenGods: BaziMatrix['tenGods'] = [];
  const tenGodSummary: Partial<Record<TenGod, number>> = {};

  for (const p of pillars) {
    if (p.label === '日干') continue;
    const god = getTenGod(dayMasterGan, p.char, p.isStem);
    tenGods.push({ char: p.char, god, pillar: p.label });
    if (god) tenGodSummary[god] = (tenGodSummary[god] || 0) + 1;
  }

  // 格局診斷
  const injured = (tenGodSummary['傷官'] || 0);
  const eatingGod = (tenGodSummary['食神'] || 0);
  const seal = (tenGodSummary['正印'] || 0) + (tenGodSummary['偏印'] || 0);
  const wealth = (tenGodSummary['正財'] || 0) + (tenGodSummary['偏財'] || 0);
  const officer = (tenGodSummary['正官'] || 0);
  const killing = (tenGodSummary['七殺'] || 0);
  const companion = (tenGodSummary['比肩'] || 0) + (tenGodSummary['劫財'] || 0);

  let pattern = '命格平衡';
  let patternDesc = '八字各柱力量均衡，無特定顯著格局，為中正平穩之命格。';
  let patternAdvice = '你的能量架構平衡而穩健，勝在持久力與適應性。策略上宜穩紮穩打，以時間換取空間，避免激進冒險。';

  if (injured >= 2 && seal >= 2) {
    pattern = '傷官配印';
    patternDesc = '傷官星旺，才華外溢、思維跳脫；印星制傷，使這股創意不至氾濫。此格局多出奇才、藝術家與思想領袖。';
    patternAdvice = '你的才華需要「容器」來承載——學術背景、師承淵源或專業資質，是你最佳的放大器。切忌在尚未建立信任之前便急於展現銳氣，否則易遭打壓。';
  } else if (eatingGod >= 2 && wealth >= 2) {
    pattern = '食神生財';
    patternDesc = '食神將能量轉化為創造力，進而生出財星。此格局最善以一技之長換取財富，是天生的創業者、IP 創作者與實業家。';
    patternAdvice = '你最大的資產是你的「方法論」——當你把自己的能力系統化並包裝輸出，財富自然隨之而來。投資自身技能，比任何外部機會都更可靠。';
  } else if (killing >= 2 && seal >= 2) {
    pattern = '殺印相生';
    patternDesc = '七殺帶來高壓與挑戰，印星將此壓力轉化為智慧與韌性。此格局最能在極端逆境中爆發，是頂尖管理者、軍事家與危機處理專家的命盤特徵。';
    patternAdvice = '你的格局需要「大風大浪」才能顯現真實價值。平靜的環境對你是一種浪費——主動尋求複雜的挑戰，你的承壓能力將成為最強的競爭護城河。';
  } else if (officer >= 1 && wealth >= 2) {
    pattern = '財官雙美';
    patternDesc = '財星滋官，仕途財路兩不誤。此格局主一生貴人多助、穩健致富，晚年福祿豐厚，是教科書級的「大器晚成」命格。';
    patternAdvice = '你的策略核心是「資源整合」——利用人脈建立財務安全網，正官的出現暗示你的行為必須符合社會規範，誠信是你最重要的長期資產。';
  } else if (companion >= 3) {
    pattern = '比劫爭財';
    patternDesc = '比肩劫財過旺，代表競爭意識強烈，同儕壓力大，易遭人搶奪機會與財富。但此格局若逢官殺制衡，則反而能激發超強鬥志。';
    patternAdvice = '你身邊的競爭者是你最好的磨刀石，但也要警惕「同室操戈」的風險。建立差異化優勢，而非與他人在同一賽道廝殺，方是上策。';
  } else if (seal >= 3) {
    pattern = '印旺洩身';
    patternDesc = '印星過旺，思想世界豐富，但行動力相對不足。此格局多出學者、思想家，但若無食傷洩秀，能量容易停滯在「想」的層面而難以落地。';
    patternAdvice = '你最大的敵人是過度思考。設定「最小可行性行動」並立即執行，哪怕不完美——落地的 60 分，勝過停滯的 100 分。';
  }

  // 能量處方箋
  const sortedEls = Object.entries(elements).sort((a, b) => a[1] - b[1]);
  const weakElement  = sortedEls[0][0];
  const strongElement = sortedEls[sortedEls.length - 1][0];

  const SUPPLEMENTS: Record<string, string> = {
    木: '在日常環境中增加植栽綠化、條紋或格紋質感，辦公桌擺放細長形物品；服裝宜選草木綠、碧玉色調。木代表生長與彈性，補木能強化你的規劃力與執行韌性。',
    火: '增加暖色燈光（2700K色溫）、在辦公環境引入三角形與尖形裝飾元素；服裝宜選橘紅、玫瑰色系。火代表熱情與顯化，補火能強化你的社交魅力與行動力。',
    土: '辦公桌擺放陶瓷、石材或方形物件，環境色調偏向大地色（卡其、米白、赭石）；規律飲食作息，強化接地氣的能量。土代表穩定與厚積，補土能強化你的耐力與信用。',
    金: '使用金屬材質飾品（手錶、金屬筆架），環境引入白色、銀色與圓形元素；服裝偏向冷色系與金屬光澤。金代表決斷與收割，補金能強化你的執行力與邊界感。',
    水: '在工作空間引入水族箱、流水裝置或水景畫作；服裝宜選黑色、深藍、墨綠；增加夜間冥想或泡澡時間。水代表智慧與流動，補水能強化你的應變力與深層洞察。',
  };

  const DRAINS: Record<string, string> = {
    木: '木氣過旺，能量過於擴張，易產生過度計劃而不落地的傾向。疏導方式：增加火屬性元素（暖光、紅色）；有意識地設定截止時間，強迫執行。',
    火: '火氣過旺，情緒張力強烈，易衝動行事或耗盡能量。疏導方式：增加水屬性元素（藍色、水景）；每日留出 20 分鐘靜默時間，作為情緒緩衝區。',
    土: '土氣過旺，思維趨於保守，行動遲緩，固執己見。疏導方式：增加木屬性元素（植物、綠色）；刻意接觸不同觀點的人，打破資訊繭房。',
    金: '金氣過旺，行事過於嚴苛，對自我與他人要求極高，易造成人際關係緊張。疏導方式：增加水屬性元素（流動感、深色）；練習「不完美接受」，降低非必要的高標準。',
    水: '水氣過旺，思緒流動過快，難以專注，情感波動大。疏導方式：增加土屬性元素（方形、大地色）；建立固定的日常結構，給流動的思維安裝「錨點」。',
  };

  return {
    dayMaster: dayMasterGan,
    dayMasterElement,
    monthZhi,
    elements,
    elementStatus,
    rawScores,
    strength,
    strengthScore: parseFloat(strengthScore.toFixed(1)),
    tenGods,
    tenGodSummary,
    pattern,
    patternDesc,
    patternAdvice,
    prescription: {
      weakElement,
      strongElement,
      weak:   SUPPLEMENTS[weakElement]   || '能量均衡，無需特別補強。',
      strong: DRAINS[strongElement]       || '能量均衡，無需特別疏導。',
    },
    debugLog: log,
  };
}
