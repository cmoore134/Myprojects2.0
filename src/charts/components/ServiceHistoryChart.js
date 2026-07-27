import Chart from 'react-apexcharts';
import { ServicesHistoryChartData } from '../Charts/ServicesHistoryChartData';
import { salesRecords } from '../Data/salesData';
import { purchaseRecords } from '../Data/purchasesData';
import { aggregateSalesByMonth, calculateMonthlyAverage } from '../Utilities/aggregateSalesByMonth';
import { aggregatePurchasesByMonth } from '../Utilities/aggregatePurchasesByMonth';

function ServicesHistoryChart() {
  const currentYear = new Date().getFullYear();

  // sales totals and their running average
  const salesTotals = aggregateSalesByMonth(salesRecords, currentYear);
  const salesAverage = calculateMonthlyAverage(salesTotals);

  // purchases totals and their running average
  const purchaseTotals = aggregatePurchasesByMonth(purchaseRecords, currentYear);
  const purchaseAverage = calculateMonthlyAverage(purchaseTotals);

  // Prepare chart data using the ServicesHistoryChartData function and update series with the latest sales and purchase data
  const chartData = ServicesHistoryChartData();
  chartData.series[0].data = salesTotals;
  chartData.series[1].data = purchaseTotals;
  chartData.series[2].data = salesAverage;
  chartData.series[3].data = purchaseAverage;

  return (
    <div>
      <h4>Sales & Purchase History</h4>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type={chartData.type}
        height={chartData.height}
      />
    </div>
  );
}

export default ServicesHistoryChart;
