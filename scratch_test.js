const { calculateFullFate } = require('./lib/fateLogic.ts');
for(let i = 0; i < 24; i+=2) {
  const r = calculateFullFate('2000-01-01', 'parse', i);
  console.log(`Hour ${i}: ${r.iching.hexagram} -> ${r.iching.transformedHexagram} (Line ${r.iching.changingLine})`);
}
