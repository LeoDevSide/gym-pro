import { FastifyInstance } from 'fastify'
import { createCheckIn } from './create-check-in.controller'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { validate } from './validate-check-in.controller'
import { history } from './get-user-check-in-history.controller'
import { metrics } from './get-user-check-ins-metrics.controller'
export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch('/check-ins/:checkInId/validate', validate)
}
