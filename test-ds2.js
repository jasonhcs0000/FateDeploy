const dates = [
  [2026, 5, 20, 126],
  [1989, 3, 6, 167],
  [2000, 1, 1, 66],
  [2012, 12, 21, 207],
  [2024, 2, 10, 112]
];

function getDS(y, m, d) {
  if (m === 2 && d === 29) d = 28;
  let dy = y;
  if (m < 7 || (m === 7 && d < 26)) dy = y - 1;
  
  const md = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = dy * 365;
  
  if (dy === y) {
    let s = 31 - 26; // July remaining
    for (let i = 8; i < m; i++) s += md[i];
    days += s + d;
  } else {
    let s = 31 - 26 + 31 + 30 + 31 + 30 + 31; // Jul to Dec
    for (let i = 1; i < m; i++) s += md[i];
    days += s + d;
  }
  return days;
}

dates.forEach(arr => {
  let ds = getDS(arr[0], arr[1], arr[2]);
  let offset = (ds - arr[3]) % 260;
  if (offset < 0) offset += 260;
  console.log(`${arr[0]}-${arr[1]}-${arr[2]} ds=${ds} expected=${arr[3]} offset=${offset}`);
});
