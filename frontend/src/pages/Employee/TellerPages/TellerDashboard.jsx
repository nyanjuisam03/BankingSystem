import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import MetricCard from '../../../components/Cards/MetricCard';
import { generateTicketData, generateTellerWeeklyTickets } from '../../../../utils/dataGenerations';

function TellerDashboard() {
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const ticketData = generateTicketData();
  const { dates: tellerDates, tellerTickets } = generateTellerWeeklyTickets();

  const barChartOptions = {
    series: [
      { name: 'Pending', data: ticketData.map(t => t.pending) },
      { name: 'Confirmed', data: ticketData.map(t => t.confirmed) },
      { name: 'Completed', data: ticketData.map(t => t.completed) }
    ],
    chart: { type: 'bar', stacked: true, height: 350, width: '100%' },
    xaxis: { categories: ticketData.map(t => t.date) },
    legend: { position: 'top' },
    title: { text: 'Ticket Status' }
  };

  const lineChartOptions = {
    series: [{
      name: 'Tickets Completed',
      data: tellerTickets
    }],
    chart: { type: 'line', height: 350, width: '100%' },
    xaxis: { categories: tellerDates },
    title: { text: 'Teller Weekly Ticket Completion' },
    stroke: { curve: 'smooth' }
  };

  useEffect(() => {
    if (barChartRef.current) {
      const barChart = new ApexCharts(barChartRef.current, barChartOptions);
      barChart.render();
    }

    if (lineChartRef.current) {
      const lineChart = new ApexCharts(lineChartRef.current, lineChartOptions);
      lineChart.render();
    }
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard 
          title="Number of Tickets Confirmed"
          value={ticketData.reduce((sum, entry) => sum + entry.confirmed, 0)}
        />
        <MetricCard 
          title="Number of Tickets Completed"
          value={ticketData.reduce((sum, entry) => sum + entry.completed, 0)}
        />
        <MetricCard 
          title="Number of Accounts Verified"
          value={ticketData.reduce((sum, entry) => sum + entry.accountVerified, 0)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div ref={barChartRef}></div>
        <div ref={lineChartRef}></div>
      </div>
    </div>
  );
}

export default TellerDashboard;