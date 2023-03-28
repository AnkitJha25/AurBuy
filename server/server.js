const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

// import routes
const authRoutes = require('./routes/auth');

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {})
.then(() => console.log('DB CONNECTED'))
.catch(err => console.log(`DB CONNECTTION ERR ${err}`));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: "2mb"}));
app.use(cors());

// routes middleware
app.use('/api', authRoutes);

// port
const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port}`));