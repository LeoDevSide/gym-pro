import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register.controller'
import { authenticateUser } from './controllers/authenticate.controller'
import { profile } from './controllers/profile.controller'
import { verifyJWT } from './middlewares/verify-jwt'
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)

  // Only Authenticated users
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
