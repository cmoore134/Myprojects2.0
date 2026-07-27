import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { SalesChartData } from '../Charts/SalesChartData';
import { salesRecords } from '../Data/salesData';
import { aggregateSalesByMonth, calculateMonthlyAverage } from '../Utilities/aggregateSalesByMonth';

export default function SalesChart() {
  const currentYear = new Date().getFullYear();

  // Initialize sales data state with aggregated totals and average for the current year
  const [salesData, setSalesData] = useState(() => {
    const totals = aggregateSalesByMonth(salesRecords, currentYear);
    return { totalSales: totals, average: calculateMonthlyAverage(totals) };
  });
  const [usingMockData, setUsingMockData] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch sales data from the API when the component mounts or when the current year changes
  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/sales/');

        if (!response.ok) {
          throw new Error('API not ready');
        }

        const rawSales = await response.json();
        const totals = aggregateSalesByMonth(rawSales, currentYear);
        setSalesData({ totalSales: totals, average: calculateMonthlyAverage(totals) });
        setUsingMockData(false);
      } catch (error) {
        console.log('Using local sales data - API not connected yet:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesData();
  }, [currentYear]);

  // Prepare chart data using the SalesChartData function and update series with the latest sales data
  const chartData = SalesChartData();
  chartData.series[0].data = salesData.totalSales;
  chartData.series[1].data = salesData.average;

  if (loading) {
    return <div>Loading sales data...</div>;
  }

  return (
    <div className="sales-chart-card">
      <h3>Sales Overview</h3>
      {usingMockData && (
        <span style={{ fontSize: '12px', color: '#999' }}>
          (showing local data - live API not yet connected)
        </span>
      )}
      <Chart
        options={chartData.options}
        series={chartData.series}
        type={chartData.type}
        height={chartData.height}
      />
    </div>
  );
}
