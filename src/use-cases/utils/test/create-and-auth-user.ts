import { agent } from 'supertest'
import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { hash } from 'bcryptjs'

export default async function createAndAuthRandomUser(
  app: FastifyInstance,
  isAdmin?: boolean,
  email?: string,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: email ?? 'admin@example.com',
      password_hash: await hash('randompass', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })
  const authResponse = await agent(app.server).post('/sessions').send({
    email: 'admin@example.com',
    password: 'randompass',
  })
  const { token } = authResponse.body
  return { token }
}
