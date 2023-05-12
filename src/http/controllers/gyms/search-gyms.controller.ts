import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import SearchGymsUseCaseFactory from '../../../use-cases/factories/search-gyms.usecase.factory'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    search: z.string(),
    page: z.coerce.number().default(1),
  })

  const { search, page } = searchGymsQuerySchema.parse(request.query)

  try {
    const searchGymsUseCase = SearchGymsUseCaseFactory.create()
    const output = await searchGymsUseCase.execute({
      search,
      page,
    })
    return reply.status(200).send(output)
  } catch (err) {}
}
