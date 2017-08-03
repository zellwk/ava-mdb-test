import test from 'ava'
import request from 'supertest'
import User from '../models/User'

import {before, beforeEach, afterEach, after} from './utils'

test.before(before)
test.beforeEach(beforeEach)
test.afterEach.always(afterEach)

// First test
test.serial('litmus get user', async t => {
  const { app } = t.context
  const res = await request(app)
    .get('/litmus')
    .send({email: 'one@example.com'})
  t.is(res.status, 200)
  t.is(res.body.name, 'One')
})

// Second test
// Note: subsequent tests must be serial tests.
// It is NOT RECOMMENDED to run parallel tests within an AVA test file when using Mongoose
test.serial('litmus create user', async t => {
  const { app } = t.context
  const res = await request(app)
    .post('/litmus')
    .send({
      email: 'new@example.com',
      name: 'New name'
    })

  t.is(res.status, 200)
  t.is(res.body.name, 'New name')

  // Verifies that user is created in DB
  const newUser = await User.findOne({email: 'new@example.com'})
  t.is(newUser.name, 'New name')
})

test.after.always(after)
