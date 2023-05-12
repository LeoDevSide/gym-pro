import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { authenticateUser } from './authenticate.controller'
import { registerUser } from './register.controller'
import { profile } from './profile.controller'
export async function userRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)

  // Only Authenticated users
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
