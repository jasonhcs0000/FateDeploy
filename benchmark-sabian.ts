const { calculateFullFate } = require('./lib/fateLogic');

const testDates = [
  { d: '2026-03-21', title: '春分' },
  { d: '2026-06-21', title: '夏至' },
  { d: '1999-12-31', title: '跨世紀' },
  { d: '2012-12-21', title: '瑪雅末日' },
  { d: '2026-05-14', title: '今日' }
];

console.log("=== 薩比恩象徵度數深度壓力測試 ===");
testDates.forEach(test => {
  const result = calculateFullFate(test.d, 'parse', 0); // Assuming hour 0 for standard checks
  console.log(`[${test.d} ${test.title}] ${result.astrology.sabian}`);
  console.log(`  標題: ${result.astrology.data.title}`);
  if (result.astrology.warning) {
    console.log(`  警告: ${result.astrology.warning}`);
  }
  console.log("-----------------------------------------");
});
