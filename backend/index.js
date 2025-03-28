const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const accountRoutes = require('./src/routes/account.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const userRoutes = require('./src/routes/user.routes');
const LoanRoutes=require('./src/routes/loans.routes')
const BookingTicketRoutes=require('./src/routes/bookingticket.route')
const CardRoutes=require('./src/routes/card.routes')
const ServiceRoute=require('./src/routes/manageTickets.route.')
const AssetRoute=require('./src/routes/assets.routes')
const NotificationRoute=require('./src/routes/notifcation.routes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', LoanRoutes)
app.use('/api/booking', BookingTicketRoutes)
app.use('/api/card', CardRoutes);
app.use('/api/management' ,ServiceRoute)
app.use('/api/assets', AssetRoute)
app.use('/api/notification',NotificationRoute)



const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});