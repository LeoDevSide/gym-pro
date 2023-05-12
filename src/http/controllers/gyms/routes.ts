import { FastifyInstance } from 'fastify'
import { createGym } from './creeate-gym.controller'

export async function gymRoutes(app: FastifyInstance) {
  // Only Authenticated users
  app.post('/gyms', createGym)
}
