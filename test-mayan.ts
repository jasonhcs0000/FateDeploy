const { calculateFullFate } = require('./lib/fateLogic');

const testDates = [
  '2026-05-20',
  '1989-03-06',
  '2000-01-01',
  '2012-12-21',
  '2024-02-10'
];

testDates.forEach(date => {
  const result = calculateFullFate(date, 'parse', 0);
  console.log(`Date: ${date} -> Kin: ${result.mayan.kin}, Title: ${result.mayan.title}`);
});
