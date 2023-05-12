import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import GetNearGymUseCaseFactory from '../../../use-cases/factories/get-near-gyms.usecase.factory'

export async function getNear(request: FastifyRequest, reply: FastifyReply) {
  const getNearGymsQuerySchema = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  })
  const { latitude, longitude } = getNearGymsQuerySchema.parse(request.query)
  try {
    const getNearGymsUseCase = GetNearGymUseCaseFactory.create()
    const output = await getNearGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })
    return reply.status(200).send(output)
  } catch (err) {}
}
