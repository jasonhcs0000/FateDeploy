const { calculateFullFate } = require('./lib/fateLogic');

console.log("🧬 啟動人類圖 (Human Design) 金標壓力測試...\n");

const tests = [
  {
    date: "1989-03-06",
    hourIndex: 7, // 13:30 (未時)
    expectedType: "顯示者 (Manifestor)",
    desc: "指標性金標測資 (Regression Test 防護牆)"
  },
  {
    date: "1980-08-08",
    hourIndex: 0,
    expectedType: "投射者 (Projector)",
    desc: "投射者與八字超重共振測試"
  },
  {
    date: "2000-01-01",
    hourIndex: 0,
    expectedType: "投射者 (Projector)",
    desc: "投射者與機月同梁共振測試"
  }
];

let allPassed = true;

for (const test of tests) {
  console.log(`測試日期: ${test.date} (${test.desc})`);
  const result = calculateFullFate(test.date, 'parse', test.hourIndex);
  
  if (!result) {
    console.error(`❌ 錯誤: 無法解析日期 ${test.date}`);
    allPassed = false;
    continue;
  }
  
  const hdTypeTitle = result.humanDesign.typeData.type;
  console.log(`預期類型: ${test.expectedType}`);
  console.log(`實際產出: ${hdTypeTitle}`);
  
  if (hdTypeTitle.includes(test.expectedType.split(' ')[0])) { // Check prefix 顯示者
    console.log("✅ 測試通過\n");
  } else {
    console.error(`❌ Regression 發生! 預期為 ${test.expectedType} 但得到 ${hdTypeTitle}\n`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log("🚀 所有人類圖金標測試皆通過！防護牆運作正常。");
  process.exit(0);
} else {
  console.error("💥 發現 Regression! 請檢查 fateLogic.ts 的映射邏輯！");
  process.exit(1);
}
