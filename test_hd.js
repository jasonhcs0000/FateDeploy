const { Solar, Lunar } = require('lunar-javascript');

const inputDate = new Date("1989-03-06");
const solar = Solar.fromDate(inputDate);
const lunar = Lunar.fromDate(inputDate);
const lunarDay = lunar.getDay();

const seed1 = solar.getYear() * 10000 + solar.getMonth() * 100 + lunarDay;
const hash1 = (seed1 * 9301 + 49297) % 233280;
const randType = (hash1 / 233280) * 100;

let hdTypeKey = "";
if (randType < 37) hdTypeKey = "純生產者";
else if (randType < 70) hdTypeKey = "顯示生產者";
else if (randType < 90) hdTypeKey = "投射者";
else if (randType < 99) hdTypeKey = "顯示者";
else hdTypeKey = "反映者";

console.log("RandType:", randType);
console.log("HD Type:", hdTypeKey);
