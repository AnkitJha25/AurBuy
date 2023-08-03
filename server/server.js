const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {readdirSync} = require("fs");
require('dotenv').config()

// import routes
// const authRoutes = require('./routes/auth');

//app
const app = express();

//db
const connection= async (URL)=>{
    try {
        // const URL='mongodb+srv://ankit:123@cluster0.szlik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true});
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error: ', error.message);
    }
}
connection(process.env.DATABASE);
// mongoose.connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useFindAndModify: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('DB CONNECTED'))
// .catch(err => console.log(`DB CONNECTTION ERR ${err}`));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: "2mb"}));
app.use(cors());

// routes middleware
//app.use('/api', authRoutes);
readdirSync("./routes").map((r) => app.use('/api', require("./routes/" + r)));

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));