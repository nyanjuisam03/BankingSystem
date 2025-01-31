import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import MetricCard from '../../../components/Cards/MetricCard';

function LoanDashboard() {
  const barChartRef = useRef(null);

  // Dummy data generation
  const generateLoanData = () => {
    return {
      approved: Math.floor(Math.random() * 50) + 20,
      appointments: Math.floor(Math.random() * 30) + 15,
      pending: Math.floor(Math.random() * 25) + 10,
      submitted: Math.floor(Math.random() * 40) + 30,
      under_review: Math.floor(Math.random() * 35) + 25,
      rejected: Math.floor(Math.random() * 20) + 5
    };
  };

  const loanData = generateLoanData();

  const barChartOptions = {
    series: [{
      name: 'Number of Loans',
      data: [
        loanData.submitted,
        loanData.under_review,
        loanData.approved,
        loanData.rejected
      ]
    }],
    chart: {
      type: 'bar',
      height: 350,
      width: '100%',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Submitted', 'Under Review', 'Approved', 'Rejected'],
    },
    yaxis: {
      title: {
        text: 'Number of Loans'
      }
    },
    fill: {
      opacity: 1,
      colors: ['#4F46E5', '#F59E0B', '#10B981', '#EF4444']
    },
    title: {
      text: 'Loan Status Distribution',
      align: 'center',
      style: {
        fontSize: '18px'
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " loans"
        }
      }
    }
  };

  useEffect(() => {
    if (barChartRef.current) {
      const chart = new ApexCharts(barChartRef.current, barChartOptions);
      chart.render();

      // Cleanup on component unmount
      return () => {
        chart.destroy();
      };
    }
  }, []);
  return (
    <div className="p-6">
    <div className="grid grid-cols-3 gap-2 mb-6">
      <MetricCard 
        title="Number of Loans Approved"
        value={loanData.approved}
      />
      <MetricCard 
        title="Number of Appointments"
        value={loanData.appointments}
      />
      <MetricCard 
        title="Number of Loans Pending"
        value={loanData.pending}
      />
    </div>

    <div className="bg-white rounded-lg shadow p-4">
      <div ref={barChartRef}></div>
    </div>
  </div>
  )
}

export default LoanDashboard
