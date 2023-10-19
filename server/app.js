const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const UserRoute = require('./routes/user')

mongoose.connect('mongodb://localhost:27017/testdb', {maxPoolSize:50,
        wtimeoutMS:2500,
        useNewUrlParser:true})

const db = mongoose.connection

// In case of unit tests, close mongoDB 
// connections immediately after all the tests
if (process.env.NODE_ENV === 'test')
  afterAll(() => mongoose.disconnect());

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log("Connected to the db!")
})

const AuthRoute = require('./routes/auth')
const cors = require("cors")

app.use(morgan('dev'))
app.use(cors());

app.get("/", function (req, res) {
  res.send({"version":"V1"});
});

app.use('/api/user', UserRoute)
app.use('/api', AuthRoute)


// export
module.exports = app;