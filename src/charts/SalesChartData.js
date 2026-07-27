export function SalesChartData() {
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
            download: '<i class="fas fa-download"></i>',
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: false
          },
          export: {
            csv: false,
            svg: false,
            png: {
              filename: 'SalesAccountChart'
            }
          }
        }
      },

      // Line/bar appearance: line thickness, curve style, bar width, colors, transparency
      stroke: {
        width: [0, 3],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      colors: ['#6F4E37', '#F5E6CA'],
      fill: {
        opacity: [0.85, 1]
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
        },
        markers: {
          customHTML() {
            return '';
          }
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
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 40]
      },
      {
        name: 'Average',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51]
      }
    ]
  };
}
