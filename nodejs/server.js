const express = require('express');
const cors = require('cors');


const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

//cors middleware
const corsOptions = {
    origin: [process.env.CORS_DOMAIN], // Pass single domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token'
};
app.use(cors(corsOptions));
// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    console.log('environment: ' + process.env)
});
