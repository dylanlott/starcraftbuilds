import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Build } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, build

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  build = await Build.create({ user })
})

test('POST /builds 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', description: 'test', steps: 'test', comments: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.steps).toEqual('test')
  expect(body.comments).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /builds 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /builds 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user).toEqual('object')
})

test('GET /builds 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /builds/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${build.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(build.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /builds/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${build.id}`)
  expect(status).toBe(401)
})

test('GET /builds/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /builds/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${build.id}`)
    .send({ access_token: userSession, title: 'test', description: 'test', steps: 'test', comments: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(build.id)
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.steps).toEqual('test')
  expect(body.comments).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /builds/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${build.id}`)
    .send({ access_token: anotherSession, title: 'test', description: 'test', steps: 'test', comments: 'test' })
  expect(status).toBe(401)
})

test('PUT /builds/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${build.id}`)
  expect(status).toBe(401)
})

test('PUT /builds/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', description: 'test', steps: 'test', comments: 'test' })
  expect(status).toBe(404)
})

test('DELETE /builds/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${build.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /builds/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${build.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /builds/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${build.id}`)
  expect(status).toBe(401)
})

test('DELETE /builds/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
