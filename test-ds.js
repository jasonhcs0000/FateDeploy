const dates = [[2026,5,20, 126],[1989,3,6, 167],[2000,1,1, 66],[2012,12,21, 207],[2024,2,10, 112]];

function getDreamspellDays(y, m, d) {
  // Days in month ignoring leap days
  const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = y * 365;
  for (let i = 1; i < m; i++) days += monthDays[i];
  if (m === 2 && d === 29) {
    days += 28;
  } else {
    days += d;
  }
  return days;
}

dates.forEach(arr => {
  const ds = getDreamspellDays(arr[0], arr[1], arr[2]);
  const expected = arr[3];
  let offset = (ds - expected) % 260;
  if (offset < 0) offset += 260;
  console.log(`${arr[0]}-${arr[1]}-${arr[2]} -> DS Days: ${ds}, Expected Kin: ${expected}, Required Epoch Offset: ${offset}`);
});
