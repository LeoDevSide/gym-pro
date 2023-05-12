import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import GetNearGymUseCaseFactory from '../../../use-cases/factories/get-near-gyms.usecase.factory'

export async function getNear(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsBodySchema = z.object({
    userLatitude: z.number(),
    userLongitude: z.number(),
  })

  const { userLatitude, userLongitude } = searchGymsBodySchema.parse(
    request.body,
  )

  try {
    const getNearGymsUseCase = GetNearGymUseCaseFactory.create()
    const output = await getNearGymsUseCase.execute({
      userLatitude,
      userLongitude,
    })
    return reply.status(200).send(output)
  } catch (err) {}
}
