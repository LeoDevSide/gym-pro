import { FastifyInstance } from 'fastify'
import { createGym } from './creeate-gym.controller'
import { search } from './search-gyms.controller'
import { getNear } from './get-near-gyms.controller'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/gyms/search', search)
  app.post('/gyms/neargyms', getNear)

  // Only Authenticated users
  app.post('/gyms', createGym)
}
