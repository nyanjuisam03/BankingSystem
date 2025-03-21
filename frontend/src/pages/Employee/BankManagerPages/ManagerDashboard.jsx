import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import MetricCard from '../../../components/Cards/MetricCard';
import useTransactionStore from '../../../store/useTransactionStore';
import useLoanStore from '../../../store/loanStore';
import accountStore from '../../../store/accountStore';


function ManagerDashboard() {

  const { depositTotal, isLoading, error, fetchDepositTotal ,withdrawalTotal, isLoading: withdrawalLoading, error: withdrawalError, fetchWithdrawalTotal } = useTransactionStore();
  
  const { 
    approvedLoansTotal, 
    isLoading: loansLoading, 
    error: loansError, 
    fetchApprovedLoansTotal 
} = useLoanStore();

const { 
  approvedAccountsTotal,  
  fetchApprovedAccountsTotal 
} = accountStore();

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    fetchDepositTotal();
  }, []);


  useEffect(() => {
    fetchWithdrawalTotal();
}, []);

useEffect(() => {
  fetchApprovedAccountsTotal();
}, []);

useEffect(() => {
  fetchApprovedLoansTotal();
}, []);

  console.log(depositTotal)
 
  // Dummy data generation
  const generateData = () => {
    return {
      deposits: Math.floor(Math.random() * 1000000) + 500000,
      withdrawals: Math.floor(Math.random() * 800000) + 300000,
      loanDisbursements: Math.floor(Math.random() * 1500000) + 1000000,
      customers: {
        new: Math.floor(Math.random() * 100) + 50,
        existing: Math.floor(Math.random() * 500) + 300
      },
      loanStatus: {
        approved: Math.floor(Math.random() * 50) + 30,
        disbursed: Math.floor(Math.random() * 40) + 20,
        pending: Math.floor(Math.random() * 30) + 15,
        overdue: Math.floor(Math.random() * 20) + 10
      }
    };
  };

  const data = generateData();

  // Format currency
  const formatCurrency = (amount) => {
    // Add a check for NaN or undefined
    const validAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KSH'
    }).format(validAmount);
};

  // Pie Chart Options
  const pieChartOptions = {
    series: [data.customers.new, data.customers.existing],
    chart: {
      type: 'pie',
      height: 350,
      width: '100%'
    },
    labels: ['New Customers', 'Existing Customers'],
    colors: ['#4F46E5', '#10B981'],
    title: {
      text: 'Customer Distribution',
      align: 'center'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " customers"
        }
      }
    }
  };

  // Bar Chart Options
  const barChartOptions = {
    series: [{
      name: 'Loan Applications',
      data: [
        data.loanStatus.approved,
        data.loanStatus.disbursed,
        data.loanStatus.pending,
        data.loanStatus.overdue
      ]
    }],
    chart: {
      type: 'bar',
      height: 350,
      width: '100%'
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
    colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
    xaxis: {
      categories: ['Approved', 'Disbursed', 'Pending', 'Overdue']
    },
    title: {
      text: 'Loan Application Status',
      align: 'center'
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " applications"
        }
      }
    }
  };

  useEffect(() => {
    if (pieChartRef.current && barChartRef.current) {
      const pieChart = new ApexCharts(pieChartRef.current, pieChartOptions);
      const barChart = new ApexCharts(barChartRef.current, barChartOptions);
      
      pieChart.render();
      barChart.render();

      return () => {
        pieChart.destroy();
        barChart.destroy();
      };
    }
  }, []);


  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Deposits"
          value={formatCurrency(depositTotal)}
        />
        <MetricCard 
        title="Total Withdrawals"
        value={formatCurrency(withdrawalTotal || 0)}
    />
          <MetricCard 
                    title="Total Approved Loans"
                    value={formatCurrency(approvedLoansTotal || 0)}
                />

<MetricCard 
            title="Total Approved Accounts"
            value={approvedAccountsTotal || 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div ref={pieChartRef}></div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div ref={barChartRef}></div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
