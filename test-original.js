const { Solar } = require('lunar-typescript');
const dates = [[2026,5,20],[1989,3,6],[2000,1,1],[2012,12,21],[2024,2,10]];
dates.forEach(d => {
  const jd = Math.floor(Solar.fromYmd(d[0],d[1],d[2]).getJulianDay());
  let kin = ((jd - 2412114 + 160) % 260);
  if (kin <= 0) kin += 260;
  console.log(d.join('-') + ' -> ' + kin);
});
