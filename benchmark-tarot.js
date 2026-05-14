const { calculateFullFate } = require('./lib/fateLogic');

const testDates = [
  { d: '1980-08-08', title: '預期靈魂數：7' },
  { d: '1990-01-02', title: '預期靈魂數：22' },
  { d: '1975-05-05', title: '預期靈魂數：5' },
  { d: '2000-01-01', title: '預期靈魂數：4 (測試土能共振)' },
  { d: '2026-05-20', title: '預期靈魂數：22?' }
];

console.log("=== 塔羅靈魂數：權威驗證清單 ===");
testDates.forEach(test => {
  const result = calculateFullFate(test.d, 'parse', 0);
  console.log(`[${test.d} ${test.title}]`);
  console.log(`  靈魂數: ${result.tarot.soulNumber}`);
  console.log(`  原型: ${result.tarot.data.archetype}`);
  console.log(`  陰影: ${result.tarot.data.shadow}`);
  if (result.tarot.warning) {
    console.log(`  警告: ${result.tarot.warning}`);
  }
  console.log("-----------------------------------------");
});
