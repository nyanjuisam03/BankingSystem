export const generateTicketData = () => {
    const startDate = new Date('2023-12-01');
    const endDate = new Date('2024-01-24');
    const tickets = [];
  
    while (startDate <= endDate) {
      tickets.push({
        date: startDate.toISOString().split('T')[0],
        pending: Math.floor(Math.random() * 3),
        confirmed: Math.floor(Math.random() * 2),
        completed: Math.floor(Math.random() * 2),
        accountVerified: Math.floor(Math.random() * 2)
      });
  
      startDate.setDate(startDate.getDate() + 1);
    }
  
    return tickets;
  };
  
  export const generateTellerWeeklyTickets = () => {
    const startDate = new Date('2024-01-18');
    const endDate = new Date('2024-01-24');
    const tellerTickets = [];
    const dates = [];
  
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      tellerTickets.push(Math.floor(Math.random() * 10));
    }
  
    return { dates, tellerTickets };
  };