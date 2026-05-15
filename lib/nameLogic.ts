import cnchar from 'cnchar';

// 康熙字典高頻字筆劃校正 (MVP 測試集)
// 現代字體筆劃可能與康熙字典不同，這裡優先定義常見部首字的康熙筆劃
const KANGXI_OVERRIDES: Record<string, number> = {
  '華': 14, '草': 12, '花': 10, '洋': 10, '海': 11, '清': 12, '情': 12, 
  '王': 4, '大': 3, '明': 8, '陳': 16, '林': 8, '黃': 12, '張': 11, '李': 7
};

// 取得單字筆劃
export function getStroke(char: string): { stroke: number; isFallback: boolean } {
  if (KANGXI_OVERRIDES[char]) {
    return { stroke: KANGXI_OVERRIDES[char], isFallback: false };
  }
  
  // 呼叫 cnchar 取得標準筆劃
  const strokeData = cnchar.stroke(char, 'array');
  if (Array.isArray(strokeData) && strokeData.length > 0 && typeof strokeData[0] === 'number') {
    return { stroke: strokeData[0], isFallback: true };
  }
  return { stroke: 10, isFallback: true }; // 極端例外回退
}

export interface FiveGrids {
  tian: number; // 天格
  ren: number;  // 人格
  di: number;   // 地格
  wai: number;  // 外格
  zong: number; // 總格
  strokes: { char: string; stroke: number; isFallback: boolean }[];
}

export function calculateFiveGrids(name: string): FiveGrids {
  const nameChars = name.trim().split('').slice(0, 4);
  const strokes = nameChars.map(char => ({ char, ...getStroke(char) }));

  let tian = 0, ren = 0, di = 0, wai = 0, zong = 0;

  if (strokes.length === 2) {
    // 單姓單名 (如：王明)
    tian = strokes[0].stroke + 1;
    ren = strokes[0].stroke + strokes[1].stroke;
    di = strokes[1].stroke + 1;
    zong = strokes[0].stroke + strokes[1].stroke;
    wai = zong - ren + 1 + 1; // 外格 = 總格 - 人格 + (天格假數1) + (地格假數1) => 其實外格 = 2
  } else if (strokes.length === 3) {
    // 單姓雙名 (如：王大明)
    tian = strokes[0].stroke + 1;
    ren = strokes[0].stroke + strokes[1].stroke;
    di = strokes[1].stroke + strokes[2].stroke;
    zong = strokes[0].stroke + strokes[1].stroke + strokes[2].stroke;
    wai = zong - ren + 1; // 外格 = 總格 - 人格 + (天格假數1)
  } else if (strokes.length === 4) {
    // 複姓雙名 (如：歐陽大明)
    tian = strokes[0].stroke + strokes[1].stroke;
    ren = strokes[1].stroke + strokes[2].stroke;
    di = strokes[2].stroke + strokes[3].stroke;
    zong = strokes[0].stroke + strokes[1].stroke + strokes[2].stroke + strokes[3].stroke;
    wai = zong - ren;
  } else if (strokes.length === 1) {
    // 只有一個字？防呆
    tian = strokes[0].stroke + 1;
    ren = strokes[0].stroke + 1;
    di = 2;
    zong = strokes[0].stroke;
    wai = 2;
  }

  // 確保沒有負數或零
  wai = Math.max(1, wai);

  return { tian, ren, di, wai, zong, strokes };
}

// 根據筆劃判定吉凶 (簡化版)
export function getGridFlavor(stroke: number): string {
  const good = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 63, 65, 67, 68, 81];
  if (good.includes(stroke)) return "吉";
  const fair = [26, 27, 28, 30, 38, 40, 42, 43, 50, 51, 53, 55, 57, 58, 71, 73, 75, 77, 78, 80];
  if (fair.includes(stroke)) return "平";
  return "凶";
}

// 生肖字根判定 ( MVP 演示版 )
export interface RadicalLog {
  char: string;
  type: 'CRITICAL' | 'REINFORCE' | 'INFO';
  msg: string;
}

export function analyzeNameRadicals(name: string, zodiac: string): RadicalLog[] {
  const logs: RadicalLog[] = [];
  const nameChars = name.trim().split('');
  
  nameChars.forEach(char => {
    let hasMatch = false;
    
    // 生肖馬 (午)
    if (zodiac === '馬') {
      if (['子', '水', '冰', '泰', '清', '海'].some(r => char.includes(r))) {
        logs.push({ char, type: 'CRITICAL', msg: `【字根衝剋】檢測到『${char}』含水/子字根，子午相沖，耗損本命能量。` });
        hasMatch = true;
      }
      if (['寅', '戌', '木', '林', '森', '大', '火', '明', '炎'].some(r => char.includes(r))) {
        logs.push({ char, type: 'REINFORCE', msg: `【生肖契合】檢測到『${char}』含寅戌/木火字根，寅午戌三合，生旺命格。` });
        hasMatch = true;
      }
    }
    
    // 生肖鼠 (子)
    if (zodiac === '鼠') {
      if (['午', '馬', '火', '炎', '南'].some(r => char.includes(r))) {
        logs.push({ char, type: 'CRITICAL', msg: `【字根衝剋】檢測到『${char}』含午/火字根，子午相沖，水火不容。` });
        hasMatch = true;
      }
      if (['申', '辰', '水', '海', '清', '金', '銀'].some(r => char.includes(r))) {
        logs.push({ char, type: 'REINFORCE', msg: `【生肖契合】檢測到『${char}』含申辰/水字根，申子辰三合，如魚得水。` });
        hasMatch = true;
      }
    }

    if (!hasMatch) {
      logs.push({ char, type: 'INFO', msg: `【平】掃描『${char}』：能量平穩，無觸發特殊生肖效應。` });
    }
  });

  return logs;
}
