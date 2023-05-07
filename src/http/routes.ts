import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register.controller'
import { authenticateUser } from './controllers/authenticate.controller'
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)
}
