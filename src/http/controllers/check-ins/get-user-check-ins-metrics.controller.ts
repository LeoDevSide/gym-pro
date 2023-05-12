import { FastifyReply, FastifyRequest } from 'fastify'
import GetUserMetricsUseCaseFactory from '../../../use-cases/factories/get-user-metrics.usecase.factory'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserCheckInsMetricsUseCase = GetUserMetricsUseCaseFactory.create()
    const output = await getUserCheckInsMetricsUseCase.execute({
      userId: request.user.sub,
    })
    return reply.status(200).send(output)
  } catch (err) {}
}
