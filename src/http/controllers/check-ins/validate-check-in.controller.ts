import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import ValidateCheckInUseCaseFactory from '../../../use-cases/factories/validate-check-in.usecas.factory'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const getUserCheckInsParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = getUserCheckInsParamsSchema.parse(request.params)

  try {
    const validateCheckInUseCase = ValidateCheckInUseCaseFactory.create()
    await validateCheckInUseCase.execute({
      checkInId,
    })
    return reply.status(204).send()
  } catch (err) {}
}
