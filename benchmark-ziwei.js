const { calculateFullFate } = require('./lib/fateLogic.ts');

const dates = [
  { date: '1980-08-08', hour: 9 }, // 貪狼 + 5.3 -> 將才
  { date: '2000-01-01', hour: 1 }, // 天機 + 投射者 -> 軍師
  { date: '1990-01-02', hour: 0 }, 
  { date: '2026-05-20', hour: 0 }
];

for (const d of dates) {
  const r = calculateFullFate(d.date, 'parse', d.hour);
  console.log(`Date: ${d.date}`);
  console.log("HD Type: ", r.humanDesign.typeData.type);
  console.log("Weight: ", r.bazi.weightStr);
  console.log("Ziwei Star: ", r.ziwei.star);
  console.log("Ziwei Resonance Warning: ", r.ziwei.warning);
  console.log("=========================================");
}
