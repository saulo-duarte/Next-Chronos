export function roundToNearest15(date: Date) {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  if (remainder < 7.5) {
    date.setMinutes(minutes - remainder);
  } else {
    date.setMinutes(minutes + (15 - remainder));
  }
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
