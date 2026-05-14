const dates = [
  [2026, 5, 20, 126],
  [1989, 3, 6, 167],
  [2000, 1, 1, 66],
  [2012, 12, 21, 207],
  [2024, 2, 10, 112]
];

dates.forEach(arr => {
  const Y = arr[0];
  const M = arr[1];
  const D = arr[2];
  const expected = arr[3];

  const a = Math.floor((14 - M) / 12);
  const y = Y + 4800 - a;
  const m = M + 12 * a - 3;
  const jd = D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  let offset = (jd - expected) % 260;
  if (offset < 0) offset += 260;

  console.log(`${Y}-${M}-${D} -> jd: ${jd}, expected: ${expected}, epoch offset needed: ${offset}`);
});
