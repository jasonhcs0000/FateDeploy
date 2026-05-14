import { calculateFullFate } from './lib/fateLogic';

const cases = [
  { date: '1990-01-27', hour: 0, desc: '己巳年 正月 初一 子時', expect: 3.2 },
  { date: '1984-06-06', hour: 6, desc: '甲子年 五月 初七 午時', expect: 4.6 },
  { date: '2026-02-17', hour: 2, desc: '丙午年 正月 初一 寅時', expect: 3.1 },
  { date: '1995-10-24', hour: 11, desc: '乙亥年 九月 初一 亥時', expect: 3.8 },
  { date: '1977-03-20', hour: 3, desc: '丁巳年 二月 初一 卯時', expect: 3.0 },
  { date: '2012-05-20', hour: 4, desc: '壬辰年 四月 廿九 辰時', expect: 4.4 },
  { date: '1988-12-12', hour: 8, desc: '戊辰年 十一月 初四 申時', expect: 4.4 },
  { date: '2005-09-03', hour: 9, desc: '乙酉年 七月 廿十 酉時', expect: 5.4 },
  { date: '1968-04-04', hour: 1, desc: '戊申年 三月 初七 丑時', expect: 4.6 },
  { date: '2030-01-01', hour: 0, desc: '己酉年 十一月 廿八 子時', expect: 3.8 }
];

for (const c of cases) {
  try {
    const res = calculateFullFate(c.date, 'parse', c.hour);
    console.log(`[Test] ${c.date} (Hour ${c.hour}) -> Actual: ${res?.weightNum} | Expected: ${c.expect}`);
  } catch (e: any) {
    console.log(`[Test] ${c.date} -> Error: ${e.message}`);
  }
}
