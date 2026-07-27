export function ServicesHistoryChartData() {
  return {
    height: 350,
    type: 'line',

    options: {
      // Chart level setup: background, toolbar buttons, and export options
      chart: {
        background: 'transparent',
        toolbar: {
          show: true,
          tools: {
            zoom: false,
            zoomin: true,
            zoomout: true,
          }
        }
      },

      // Line/bar appearance: line thickness, curve style, bar width, colors, transparency
      stroke: {
        width: [0, 0, 3, 3],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      },
      colors: ['#6F4E37', '#C68E4C', '#3C2415', '#f4d7a2'], // sales bar, purchases bar, sales line, purchases line
      fill: {
        opacity: [0.85, 0.85, 1, 1]
      },

      // Axis setup: x-axis month labels, no point markers, y-axis starts at 0 with whole numbers
      labels: ['Jan 01', 'Feb 01', 'Mar 01', 'Apr 01', 'May 01', 'Jun 01', 'Jul 01', 'Aug 01', 'Sep 01', 'Oct 01', 'Nov 01', 'Dec 01'],
      markers: {
        size: 0
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (value) {
            return value.toFixed(0);
          }
        }
      },

      // Grid lines and tooltip formatting (shows $ amounts when hovering)
      grid: {
        strokeDashArray: 0,
        borderColor: '#f5f5f5'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter(y) {
            if (typeof y !== 'undefined') {
              return `$ ${y.toFixed(0)}`;
            }
            return y;
          }
        }
      },

      // Legend styling and overall light theme
      legend: {
        labels: {
          useSeriesColors: true
        }
      },
      theme: {
        mode: 'light'
      }
    },

    // The actual data: bars for Total Sales, line for Average, one value per month
    series: [
      {
        name: 'Total Sales',
        type: 'column',
        data: []
      },
      {
        name: 'Total Purchases',
        type: 'column',
        data: []
      },
      {
        name: 'Sales Average',
        type: 'line',
        data: []
      },
      {
        name: 'Purchases Average',
        type: 'line',
        data: []
      }
    ]
  };
}
