const start = "2026-05-15"; // Friday
const sd = new Date(start + 'T00:00:00Z');
const workingDayMap = {};
let actual = 1;
for (let logical = 1; logical <= 10; logical++) {
  let d = new Date(sd);
  d.setUTCDate(d.getUTCDate() + (actual - 1));
  while (d.getUTCDay() === 0) { // Sunday
    actual++;
    d = new Date(sd);
    d.setUTCDate(d.getUTCDate() + (actual - 1));
  }
  workingDayMap[logical] = actual;
  actual++;
}
console.log(workingDayMap);
