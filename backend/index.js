const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

// app
const app = express();
app.use(cors());
app.use(express.json());

// home
app.get('/', (req, res) => {
    res.send({message: 'Welcome'});
});

// routes
const authRoute = require('./routes/auth_dummy');
app.use('/api/auth', authRoute);

const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);

const threadsRoute = require('./routes/threads');
app.use('/api/threads', threadsRoute);

const searchRoute = require('./routes/search');
app.use('/api/search', searchRoute);

const groupsRoute = require('./routes/groups');
app.use('/api/groups', groupsRoute);

const chatsRoute = require('./routes/chats');
app.use('/api/chats', chatsRoute);

// DB connection
// mongoose.connect(process.env.DATABASE_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
//     console.log('DB is connected!');
// });

const PORT = process.env.port || 3001;
app.listen(PORT, () => console.log(`App is served via port ${PORT}`));
