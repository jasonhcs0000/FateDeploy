const { Solar, Lunar } = require('lunar-typescript');

const benchmarks = [
  { date: '1980-08-08', expType: '投射者', expProfile: '4/6' },
  { date: '2000-01-01', expType: '反映者', expProfile: '1/3' },
  { date: '1990-01-02', expType: '顯示者', expProfile: '5/1' },
  { date: '2026-05-20', expType: '純生產者', expProfile: '2/4' },
  { date: '1985-05-20', expType: '顯示生產者', expProfile: '5/2' }
];

function getHashValues(dateStr) {
  const d = new Date(dateStr);
  const s = Solar.fromDate(d);
  const l = Lunar.fromDate(d);
  const sm = s.getMonth();
  const sd = s.getDay();
  const sy = s.getYear();
  const lm = l.getMonth();
  const ld = l.getDay();
  return { sm, sd, sy, lm, ld };
}

benchmarks.forEach(b => {
  console.log(b.date, getHashValues(b.date));
});
