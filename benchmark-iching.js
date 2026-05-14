const { calculateFullFate } = require('./lib/fateLogic.ts');

const dates = [
  { date: '1980-08-08', hour: 9 }, // 申時=9
  { date: '2000-01-01', hour: 1 }, // 子時=1
  { date: '1990-01-02', hour: 0 }, 
  { date: '2026-05-20', hour: 0 }
];

for (const d of dates) {
  const r = calculateFullFate(d.date, 'parse', d.hour);
  console.log(`Date: ${d.date} Hour: ${d.hour}`);
  console.log("Bazi: ", r.bazi.baziStr);
  console.log("Missing Elements: ", r.bazi.missingElements);
  console.log("IChing Original: ", r.iching.hexagram);
  console.log("IChing Transformed: ", r.iching.transformedHexagram);
  console.log("Changing Line: ", r.iching.changingLine);
  console.log("Warning: ", r.iching.warning);
  console.log("=========================================");
}
