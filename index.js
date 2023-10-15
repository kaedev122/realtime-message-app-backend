const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const multer = require('multer');

const pingRoute = require('./Routes/PingRoute');
const authRoute = require('./Routes/AuthRoute');
const userRoute = require('./Routes/UserRoute');
const chatRoute = require('./Routes/ChatRoute');
const friendRoute = require('./Routes/FriendRoute');

const { MONGO_URL, PORT, CLOUD_NAME, API_KEY, API_SECRET } = process.env;
const {v2} = require('cloudinary');

v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB is connected successfully'))
    .catch((err) => console.error(err));

    
app.use(cors({
    origin: ['https://realtime-message-app-backend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'))

app.use('/api', pingRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/friend', friendRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});