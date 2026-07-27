export function aggregateSalesByMonth(salesRecords, year) {
  // one bucket per month, starts at 0
  const monthlyTotals = new Array(12).fill(0);

  salesRecords.forEach((sale) => {
    const saleDate = new Date(sale.sale_date);

    // only include sales from the year being charted
    if (saleDate.getFullYear() === year) {
      const monthIndex = saleDate.getMonth(); // 0 = Jan, 11 = Dec
      monthlyTotals[monthIndex] += sale.sale_amount;
    }
  });

  return monthlyTotals;
}

export function calculateMonthlyAverage(monthlyTotals) {
  // simple running average up to each month
  const averages = [];
  let runningSum = 0;

  monthlyTotals.forEach((total, index) => {
    runningSum += total;
    averages.push(runningSum / (index + 1));
  });

  return averages;
}
