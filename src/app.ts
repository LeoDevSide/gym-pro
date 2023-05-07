import fastify from 'fastify'

import { registerUser } from './http/controllers/register.controller'

export const app = fastify()

app.post('/users', registerUser)
