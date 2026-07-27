export function aggregatePurchasesByMonth(purchaseRecords, year) {
  const monthlyTotals = new Array(12).fill(0);

  // Iterate through each purchase record and aggregate the purchase amounts by month for the specified year
  purchaseRecords.forEach((purchase) => {
    const purchaseDate = new Date(purchase.purchase_date);

    if (purchaseDate.getFullYear() === year) {
      const monthIndex = purchaseDate.getMonth();
      monthlyTotals[monthIndex] += purchase.purchase_amount;
    }
  });

  return monthlyTotals;
}

// Calculate the running average of monthly totals
export function calculateMonthlyAverage(monthlyTotals) {
  const averages = [];
  let runningSum = 0;
