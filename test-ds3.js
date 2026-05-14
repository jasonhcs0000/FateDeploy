const { Solar } = require('lunar-typescript');
const dates = [
  [2026,5,20,126],
  [1989,3,6,167],
  [2000,1,1,66],
  [2012,12,21,207],
  [2024,2,10,112]
];

function getLeaps(y,m,d) {
  let c = 0;
  for(let year = 1988; year <= y; year += 4) {
    if (year % 100 === 0 && year % 400 !== 0) continue;
    if (year < y || (year === y && (m > 2 || (m === 2 && d >= 29)))) {
      c++;
    }
  }
  return c;
}

dates.forEach(arr => {
  const jd = Math.floor(Solar.fromYmd(arr[0],arr[1],arr[2]).getJulianDay());
  const epochJD = 2447002; // 1987-07-26
  const leaps = getLeaps(arr[0],arr[1],arr[2]);
  
  let diff = jd - epochJD - leaps;
  let kin = (diff % 260) + 34; // 34 is Kin for 1987-07-26
  if (kin <= 0) kin += 260;
  if (kin > 260) kin %= 260;
  if (kin === 0) kin = 260;
  
  console.log(`${arr[0]}-${arr[1]}-${arr[2]} -> ${kin} (Expected: ${arr[3]})`);
});
