const dates = [
  [2026, 5, 20, 126],
  [1989, 3, 6, 167],
  [2000, 1, 1, 66],
  [2012, 12, 21, 207],
  [2024, 2, 10, 112]
];

function getKin(y, m, d) {
  if (m === 2 && d === 29) d = 28;
  
  let dy = y;
  if (m < 7 || (m === 7 && d < 26)) dy = y - 1;
  
  let base = (34 + (dy - 1987) * 105) % 260;
  if (base <= 0) base = (base % 260) + 260;
  
  const md = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = 0;
  
  if (m === 7) {
    days = d - 26;
  } else if (m > 7) {
    days = 31 - 26;
    for (let i = 8; i < m; i++) days += md[i];
    days += d;
  } else {
    days = 31 - 26 + 31 + 30 + 31 + 30 + 31;
    for (let i = 1; i < m; i++) days += md[i];
    days += d;
  }
  
  let kin = (base + days) % 260;
  if (kin === 0) kin = 260;
  
  return kin;
}

dates.forEach(arr => {
  const kin = getKin(arr[0], arr[1], arr[2]);
  console.log(`${arr[0]}-${arr[1]}-${arr[2]} -> Kin ${kin} (Expected: ${arr[3]})`);
});
