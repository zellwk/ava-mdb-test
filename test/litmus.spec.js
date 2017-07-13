import test from 'ava'
import app from '../server'
import request from 'supertest'
import User from '../models/User'
import mongoose from '../handlers/mongoose'
import MongodbMemoryServer from 'mongodb-memory-server'

const mongod = new MongodbMemoryServer()

test.before(async t => {
  mongoose.connect(await mongod.getConnectionString())
})

test.beforeEach(async t => {
  const user = new User({email: 'one@example.com', name: 'One'})
  const user2 = new User({email: 'two@example.com', name: 'Two'})
  const user3 = new User({email: 'three@example.com', name: 'Three'})
  await user.save()
  await user2.save()
  await user3.save()
  t.context.app = app
})

test.afterEach.always(async t => {
  await User.remove()
})

test('litmus get test', async t => {
  const { app } = t.context
  const res = await request(app)
    .get('/litmus')
    .send({email: 'one@example.com'})
  t.is(res.status, 200)
  t.is(res.body.name, 'One')
})

// Works if we use test.serial instead of test
test('litmus post test', async t => {
  const { app } = t.context
  const res = await request(app)
    .post('/litmus')
    .send({
      email: 'new@example.com',
      name: 'New'
    })
  t.is(res.status, 200)
  t.is(res.body.name, 'New')
  t.is(200, 200)
})

test.after.always(async t => {
  mongoose.disconnect()
  mongod.stop()
})
