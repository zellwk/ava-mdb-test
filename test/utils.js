const MongodbMemoryServer = require('mongodb-memory-server').default
const mongoose = require('mongoose')

// Your models and server
const app = require('../server')
const User = require('../models/User')

const mongod = new MongodbMemoryServer()

// Create connection to mongoose before all tests
exports.before = async t =>
  mongoose.connect(await mongod.getConnectionString(), { useMongoClient: true })

// Create fixtures before each test
exports.beforeEach = async t => {
  const user = new User({email: 'one@example.com', name: 'One'})
  const user2 = new User({email: 'two@example.com', name: 'Two'})
  const user3 = new User({email: 'three@example.com', name: 'Three'})

  await user.save()
  await user2.save()
  await user3.save()

  t.context.app = app
}

// Clean up database after every test
exports.afterEach = async t => await User.remove()

// Disconnect MongoDB and mongoose after all tests are done
exports.after = async t => {
  mongoose.disconnect()
  mongod.stop()
}
