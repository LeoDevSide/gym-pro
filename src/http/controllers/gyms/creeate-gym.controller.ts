import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import CreateGymUseCaseFactory from '../../../use-cases/factories/create-gym.usecase.factory'

export async function createGym(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
    description: z.string().nullable(),
    phone: z.string().nullable(),
  })

  const { title, latitude, longitude, description, phone } =
    createGymBodySchema.parse(request.body)

  try {
    const createGymUseCase = CreateGymUseCaseFactory.create()
    await createGymUseCase.execute({
      title,
      latitude,
      longitude,
      description,
      phone,
    })
    return reply.status(201).send()
  } catch (err) {}
}
