const mongoose = require('mongoose')
const Schema = mongoose.Schema

let EventSchema = new Schema({
  title: {
    type: String
  },
  time: {
    type: String
  },
  date: {
    type: String
  },
}, {
  collection: 'events'
})

module.exports = mongoose.model('Event', EventSchema)
