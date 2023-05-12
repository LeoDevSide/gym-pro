import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import GetUserCheckInsUseCaseFactory from '../../../use-cases/factories/get-user-check-in-history.usecase.factory'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const getUserCheckInsQuerySchema = z.object({
    page: z.coerce.number().default(1),
  })

  const { page } = getUserCheckInsQuerySchema.parse(request.body)

  try {
    const getUserCheckInsUseCase = GetUserCheckInsUseCaseFactory.create()
    const output = await getUserCheckInsUseCase.execute({
      userId: request.user.sub,
      page,
    })
    return reply.status(200).send(output)
  } catch (err) {}
}
