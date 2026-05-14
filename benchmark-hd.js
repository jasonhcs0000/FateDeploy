const { calculateFullFate } = require('./lib/fateLogic');

console.log("=== 人類圖 (Human Design) 映射分佈驗證報告 ===");

const typeCount = {};
const profileCount = {};

// Test 365 days of a year (e.g., 1990)
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= 28; d++) {
    const dateStr = `1990-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    for (let h = 0; h < 12; h++) {
      const result = calculateFullFate(dateStr, 'parse', h);
      const type = result.humanDesign.typeData.type;
      const profile = result.humanDesign.profileData.profile;
      
      typeCount[type] = (typeCount[type] || 0) + 1;
      profileCount[profile] = (profileCount[profile] || 0) + 1;
    }
  }
}

console.log("\n[四大類型分佈]");
Object.entries(typeCount).sort((a,b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`${k}: ${v} (${((v / (12 * 28 * 12)) * 100).toFixed(2)}%)`);
});

console.log("\n[十二人生角色分佈]");
Object.entries(profileCount).sort((a,b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`${k}: ${v} (${((v / (12 * 28 * 12)) * 100).toFixed(2)}%)`);
});

// Test Specific Resonance
console.log("\n[特定共振測試]");
const r1 = calculateFullFate('1980-08-08', 'parse', 0); // known projector
console.log(`Test 1980-08-08 (Projector + Heavy Bazi): HD Type = ${r1.humanDesign.typeData.type}, Weight = ${r1.bazi.weightNum}`);
if (r1.humanDesign.warning) console.log(`Warning: ${r1.humanDesign.warning}`);

const r3 = calculateFullFate('1990-01-02', 'parse', 0);
console.log(`Test 1990-01-02 (Manifestor + Light Bazi): HD Type = ${r3.humanDesign.typeData.type}`);
if (r3.humanDesign.warning) console.log(`Warning: ${r3.humanDesign.warning}`);
