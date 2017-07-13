const mongoose = require('mongoose')
mongoose.Promise = Promise

const originalConnect = mongoose.connect

mongoose.connect = async (uri) => {
  originalConnect.bind(mongoose)(uri)

  const db = mongoose.connection
  db.on('error', err => console.error(`🚫🚫🚫 → ${err.message}`))
  db.once('open', _ => console.log(`MongoDB successfully connected to ${uri}`))
}

module.exports = mongoose
