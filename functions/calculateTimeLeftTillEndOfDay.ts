export const calculateTimeLeftTillEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(24, 0, 0, 0); // Set to midnight of the next day
  const diff = endOfDay.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}mins left`;
};