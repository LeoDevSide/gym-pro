import { FastifyInstance } from 'fastify'
import { createGym } from './creeate-gym.controller'
import { search } from './search-gyms.controller'
import { getNear } from './get-near-gyms.controller'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { verifyUserRole } from '../../middlewares/verify-user-role'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/gyms/search', search)
  app.get('/gyms/neargyms', getNear)

  // Only Authenticated users
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}
