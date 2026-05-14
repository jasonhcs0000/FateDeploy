const fs = require('fs');
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const YEAR_WEIGHTS = [
  12, 9, 6, 7, 14, 5, 9, 16, 8, 8, // 甲子 to 癸酉
  19, 12, 6, 8, 7, 5, 15, 6, 16, 15, // 甲戌 to 癸未
  16, 9, 6, 7, 12, 5, 9, 15, 7, 7, // 甲申 to 癸巳
  15, 14, 16, 9, 14, 5, 9, 17, 7, 7, // 甲午 to 癸卯
  16, 6, 8, 7, 5, 15, 6, 16, 14, 14, // 甲辰 to 癸丑
  9, 6, 7, 12, 5, 9, 15, 7, 7, 15 // 甲寅 to 癸亥
];

let gzTypes = [];
let dictEntries = [];
for(let i=0; i<60; i++){
  let gz = GAN[i%10]+ZHI[i%12];
  gzTypes.push(`'${gz}'`);
  dictEntries.push(`  "${gz}": ${YEAR_WEIGHTS[i]}`);
}

let hourWeights = [16, 6, 7, 10, 9, 16, 10, 8, 8, 9, 6, 6];
let zhiTypes = [];
let hourEntries = [];
for(let i=0; i<12; i++){
  zhiTypes.push(`'${ZHI[i]}'`);
  hourEntries.push(`  "${ZHI[i]}": ${hourWeights[i]}`);
}

const content = `export type GanZhi = ${gzTypes.join(' | ')};

export type Zhi = ${zhiTypes.join(' | ')};

export const YEAR_WEIGHTS_DICT: Record<GanZhi, number> = {
${dictEntries.join(',\n')}
};

export const MONTH_WEIGHTS: number[] = [6, 7, 18, 9, 5, 16, 9, 15, 18, 8, 9, 5];

export const DAY_WEIGHTS: number[] = [5, 10, 8, 15, 16, 15, 8, 16, 8, 16, 9, 17, 8, 17, 10, 8, 9, 18, 5, 15, 10, 9, 8, 9, 15, 18, 7, 8, 16, 6];

export const HOUR_WEIGHTS_DICT: Record<Zhi, number> = {
${hourEntries.join(',\n')}
};
`;
fs.writeFileSync('c:\\projects\\Bazi\\bazi-app\\lib\\weightData.ts', content, 'utf8');
console.log('weightData.ts generated');
