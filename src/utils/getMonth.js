export function getMonth(items) {
  const months = [];
  const cd = new Date().getMonth();
  for (let i = items; i >= 0; i--) {
    const currentDate = new Date(2022, cd - i, 1);
    const result = currentDate.toLocaleString("en", { month: "long" }).slice(0, 3);
    months.push(result);
  }
  return months;
}
