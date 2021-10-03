const express = require('express');
const userRoute = express.Router();
const jwt = require('jsonwebtoken')

// Model /////////////////////////////////////////////
const UserModel = require('../models/User');
const EventModel = require('../models/Event');

// Routes ////////////////////////////////////////////
userRoute.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API.'
  })
})

userRoute.get('/dashboard', verifyToken, (req, res) => {
  jwt.verify(req.token, 'the_secret_key', err => {
    if (err) {
      res.sendStatus(401)
    } else {
      EventModel.find(function(err, data) {
        if(err) {
          res.json(err);
        } else {
          res.json({ events: data })
        }
      })
    }
  })
})

userRoute.post('/register', (req, res) => {
  if (req.body) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    UserModel.findOne({ email: req.body.email }, function(err, result) {
      if (err) throw error
      let errorsToSend = []
      if (result) {
        errorsToSend.push('An account with this email already exists.')
      }
      if (user.name.length < 1) {
        errorsToSend.push('Name field is empty.')
      }
      if (user.email.length < 5) {
        errorsToSend.push('Email field is empty.')
      }
      if (user.password.length < 5) {
        errorsToSend.push('Password too short.')
      }
      if (errorsToSend.length > 0) {
        res.status(400).json({ errors: errorsToSend })
      } else {
        UserModel.create( req.body, err => {
          if (err) {
            console.log(err + data)
          } else {
            const token = jwt.sign({ user }, 'the_secret_key')
            res.json({
              token,
              email: user.email,
              name: user.name
            })
          }
        })
      }
    })
  }
})

userRoute.post('/login', (req, res) => {
  UserModel.findOne({ email: req.body.email, password: req.body.password },
  function(err, user) {
    if (err) throw error
    let errorsToSend = []
    if (!user) {
      errorsToSend.push('Authentication failed.')
    }
    if (errorsToSend.length > 0) {
      res.status(400).json({ error: errorsToSend })
    } else {
      const token = jwt.sign({ user }, 'the_secret_key')
      // In a production app, you'll want the secret key to be an environment variable
      res.json({
        token
      })
    }
  })
})

// MIDDLEWARE ////////////////////////////////////////////////////////////
function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(401)
  }
}

module.exports = userRoute;
