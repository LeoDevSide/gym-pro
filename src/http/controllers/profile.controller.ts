import { FastifyReply, FastifyRequest } from 'fastify'
import GetUserProfileeUseCaseFactory from '../../use-cases/factories/get-user-profile.usecase.factory'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = GetUserProfileeUseCaseFactory.create()
  const { user } = await getUserProfile.execute({ userId: request.user.sub })
  return reply.status(200).send({ user: { ...user, password_hash: undefined } })
}
