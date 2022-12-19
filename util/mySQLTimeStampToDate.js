export function mySQLTimeStampToDate(dateString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(5, 7);
  const day = dateString.substring(8, 10);
  return `${day}/${month}/${year}`;
}
