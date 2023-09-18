const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const pingRoute = require('./Routes/PingRoute');
const authRoute = require('./Routes/AuthRoute');
const userRoute = require('./Routes/UserRoute');
const { MONGO_URL, PORT } = process.env;

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB is  connected successfully'))
    .catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use(
    cors({
        origin: ['http://localhost:3001'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);
app.use(cookieParser());

app.use(express.json());

app.use('/api', pingRoute);
app.use('/api', authRoute);
app.use('/api/user', userRoute);