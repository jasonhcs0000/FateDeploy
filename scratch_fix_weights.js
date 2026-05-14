const fs = require('fs');

const trueYearWeights = {
  "甲子": 12, "乙丑": 9, "丙寅": 6, "丁卯": 7, "戊辰": 12, "己巳": 5, "庚午": 9, "辛未": 8, "壬申": 7, "癸酉": 8,
  "甲戌": 15, "乙亥": 9, "丙子": 16, "丁丑": 8, "戊寅": 8, "己卯": 19, "庚辰": 12, "辛巳": 6, "壬午": 8, "癸未": 7,
  "甲申": 5, "乙酉": 15, "丙戌": 6, "丁亥": 16, "戊子": 15, "己丑": 7, "庚寅": 9, "辛卯": 12, "壬辰": 10, "癸巳": 7,
  "甲午": 15, "乙未": 6, "丙申": 5, "丁酉": 14, "戊戌": 14, "己亥": 9, "庚子": 7, "辛丑": 7, "壬寅": 9, "癸卯": 12,
  "甲辰": 8, "乙巳": 7, "丙午": 13, "丁未": 5, "戊申": 14, "己酉": 5, "庚戌": 9, "辛亥": 16, "壬子": 5, "癸丑": 7,
  "甲寅": 12, "乙卯": 8, "丙辰": 8, "丁巳": 6, "戊午": 19, "己未": 6, "庚申": 8, "辛酉": 16, "壬戌": 10, "癸亥": 7
};

let dictEntries = [];
for (let key in trueYearWeights) {
  dictEntries.push(`  "${key}": ${trueYearWeights[key]}`);
}

const content = fs.readFileSync('c:\\projects\\Bazi\\bazi-app\\lib\\weightData.ts', 'utf8');
const newContent = content.replace(/export const YEAR_WEIGHTS_DICT: Record<GanZhi, number> = \{[\s\S]*?\};/, `export const YEAR_WEIGHTS_DICT: Record<GanZhi, number> = {\n${dictEntries.join(',\n')}\n};`);
fs.writeFileSync('c:\\projects\\Bazi\\bazi-app\\lib\\weightData.ts', newContent, 'utf8');
console.log('Fixed');
