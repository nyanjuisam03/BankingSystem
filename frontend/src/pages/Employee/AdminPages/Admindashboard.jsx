import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import MetricCard from "../../../components/Cards/MetricCard"

function Admindashboard() {
  const lineChartRef = useRef(null);

  // Dummy data for system usage
  const dates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const usageData = [25, 35, 45, 55, 70, 85, 95, 100, 110, 120];

  const lineChartOptions = {
    series: [{
      name: 'System Usage Duration',
      data: usageData
    }],
    chart: {
      type: 'line',
      height: 350,
      width: '100%'
    },
    xaxis: {
      categories: dates,
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Average Hours'
      }
    },
    title: {
      text: 'User System Usage Duration',
      align: 'left'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    }
  };

  useEffect(() => {
    if (lineChartRef.current) {
      const lineChart = new ApexCharts(lineChartRef.current, lineChartOptions);
      lineChart.render();

      // Cleanup function to destroy chart on unmount
      return () => {
        lineChart.destroy();
      };
    }
  }, []);

  return (
    <div className="p-6">
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <MetricCard
          title="Number of Users"
          value={9}
        />
        <MetricCard
          title="Number of Pending Tickets"
          value={7}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div ref={lineChartRef} className="bg-white p-4 rounded-lg shadow"></div>
      </div>
    </div>
  );
}

export default Admindashboard;