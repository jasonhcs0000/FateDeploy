import { diagnoseSolarEphemeris, getHumanDesign } from './lib/humanDesignLogic';

console.log("🔭 人類圖科學引擎 v2.0 — 天文診斷報告\n");
console.log("=".repeat(50));

const diag = diagnoseSolarEphemeris(1989, 3, 6, 13.5);
console.log("\n📡 1989-03-06 13:30 天文診斷:");
console.log(`  ★ 太陽真黃經 (λ):   ${diag.trueLongitude.toFixed(4)}°`);
console.log(`  ★ 太陽閘門:          閘門 ${diag.gate} — 爻 ${diag.line} (中心: ${diag.center})`);

// 判斷是否是情緒中心 (Solar Plexus = 動力中心)
const isMotorCenter = ['heart', 'solar', 'root'].includes(diag.center);
console.log(`  ★ 動力中心:          ${isMotorCenter ? '✅ 是動力中心！' : '❌ 非動力中心'}`);

const earthLon = (diag.trueLongitude + 180) % 360;
const earthDiag = diagnoseSolarEphemeris(1989, 3, 6, 13.5);
// Just show earth manually
console.log(`  地球黃經:            ${earthLon.toFixed(4)}°`);

console.log("\n" + "=".repeat(50));
console.log("\n🧬 類型判定測試:\n");

// hourIndex 6 = 午時 (12:00-14:00)
const result = getHumanDesign(1989, 3, 6, 6);
console.log(`  太陽閘門: ${result.sunGate} (爻 ${result.sunLine})`);
console.log(`  地球閘門: ${result.earthGate} (爻 ${result.earthLine})`);
console.log(`  薦骨中心: ${result.isSacralDefined ? '已定義 ✓' : '未定義 ✗'}`);
console.log(`  動力->喉嚨: ${result.isThroatConnectedToMotor ? '已連通 ✓' : '未連通 ✗'}`);
console.log(`  定義的中心: [${result.definedCenters.join(', ')}]`);
console.log(`\n  ★ 類型: ${result.type} (${result.typeEn})`);
console.log(`  ★ 人生角色: ${result.profile}`);

console.log("\n" + "=".repeat(50));
if (result.type === "顯示者") {
  console.log(`\n✅ 金標驗證通過！1989-03-06 正確識別為「${result.type}」`);
  process.exit(0);
} else {
  console.error(`\n❌ 金標驗證失敗！預期「顯示者」，實際「${result.type}」`);
  process.exit(1);
}
