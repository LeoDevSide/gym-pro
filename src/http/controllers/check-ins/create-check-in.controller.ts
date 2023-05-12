import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import CheeckInUseCaseFactory from '../../../use-cases/factories/check-in.usecase.factory'

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createCheckInBodySchema = z.object({
    userLatitude: z.coerce.number(),
    userLongitude: z.coerce.number(),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
    request.body,
  )

  try {
    const checkInUseCase = CheeckInUseCaseFactory.create()
    await checkInUseCase.execute({
      userId: request.user.sub,
      gymId,
      userLatitude,
      userLongitude,
    })
    return reply.status(201).send()
  } catch (err) {}
}
