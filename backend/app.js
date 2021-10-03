const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoute = require('./routes/user.route')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/', userRoute);

// MongoDB connection ///////////////////////////////////////
mongoose.Promise = global.Promise;
const db = require("./config/db.config")
mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Database connected")
  },
  error => {
    console.log("Database could't be connected to: " + error)
  }
)

// Create port /////////////////////////////////////////////////////////
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 /////////////////////////////////////////////////////////
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler /////////////////////////////////////////////////////////
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
