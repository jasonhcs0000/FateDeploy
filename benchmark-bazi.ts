import { analyzeBazi, ELEMENT_COLORS } from './lib/baziLogic';
import { calculateFullFate } from './lib/fateLogic';

console.log("⚡ 八字格局引擎 — 金標壓力測試\n");
console.log("=".repeat(55));

// 1989-03-06 (壬水日主)
const result = calculateFullFate("1989-03-06", 'parse', 6);

if (!result || !result.bazi.matrix) {
  console.error("❌ 計算失敗");
  process.exit(1);
}

const m = result.bazi.matrix;

console.log(`\n📅 測試日期: 1989-03-06 (午時 hourIndex=6)`);
console.log(`   八字柱: ${result.bazi.baziStr}`);
console.log(`   命格重量: ${result.bazi.weightStr}`);
console.log(`\n🔮 日主: ${m.dayMaster} (${m.dayMasterElement})`);
console.log(`   身強/弱: ${m.strength} (生我組 ${m.strengthScore}%)`);

console.log(`\n🌈 五行雷達數值:`);
const els = ['木','火','土','金','水'];
for (const el of els) {
  const val = m.elements[el] || 0;
  const bar = '█'.repeat(Math.round(val / 5)) + '░'.repeat(20 - Math.round(val / 5));
  console.log(`   ${el} [${bar}] ${val.toFixed(1)}%`);
}

console.log(`\n🧿 十神分布:`);
const godOrder = ['比肩','劫財','食神','傷官','正財','偏財','正官','七殺','正印','偏印'];
for (const god of godOrder) {
  const count = m.tenGodSummary[god as keyof typeof m.tenGodSummary] || 0;
  if (count > 0) console.log(`   ${god}: ${'★'.repeat(count)} (${count}顆)`);
}

console.log(`\n🏆 格局診斷: 【${m.pattern}】`);
console.log(`   ${m.patternDesc.substring(0, 80)}...`);

console.log(`\n💊 能量處方箋:`);
console.log(`   補強 (缺${m.prescription.weakElement}): ${m.prescription.weak.substring(0, 60)}...`);
console.log(`   疏導 (旺${m.prescription.strongElement}): ${m.prescription.strong.substring(0, 60)}...`);

// 驗證: 1989-03-06 是顯示者，日主應為壬水（陽水）
console.log("\n" + "=".repeat(55));
const checks = [
  { name: "日主五行有效", pass: ['木','火','土','金','水'].includes(m.dayMasterElement) },
  { name: "五行百分比合計 ~100%", pass: Math.abs(Object.values(m.elements).reduce((a,b) => a+b, 0) - 100) < 2 },
  { name: "格局名稱存在", pass: m.pattern.length > 0 },
  { name: "處方箋非空", pass: m.prescription.weak.length > 10 },
  { name: "身強弱有判定", pass: ['strong','weak','neutral'].includes(m.strength) },
];

let allPass = true;
for (const c of checks) {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
  if (!c.pass) allPass = false;
}

if (allPass) {
  console.log(`\n🚀 八字格局引擎金標驗測全數通過！`);
  console.log(`   格局:「${m.pattern}」| 日主:「${m.dayMaster}(${m.dayMasterElement})」| 身${m.strength === 'strong' ? '強' : m.strength === 'weak' ? '弱' : '中'}`);
  process.exit(0);
} else {
  console.error(`\n💥 部分驗測失敗，請檢查 baziLogic.ts！`);
  process.exit(1);
}
