import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import MetricCard from '../../../components/Cards/MetricCard';
import { generateTicketData, generateTellerWeeklyTickets } from '../../../../utils/dataGenerations';

function TellerDashboard() {
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  // Refs to store chart instances
  const barChartInstance = useRef(null);
  const lineChartInstance = useRef(null);

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
    // Check if chart instances exist and destroy them before creating new ones
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }

    // Create new chart instances
    if (barChartRef.current) {
      barChartInstance.current = new ApexCharts(barChartRef.current, barChartOptions);
      barChartInstance.current.render();
    }

    if (lineChartRef.current) {
      lineChartInstance.current = new ApexCharts(lineChartRef.current, lineChartOptions);
      lineChartInstance.current.render();
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array since we only want to create charts once

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

      <div className="grid grid-cols-2 gap-6">
        <div ref={barChartRef}></div>
        <div ref={lineChartRef}></div>
      </div>
    </div>
  );
}

export default TellerDashboard;