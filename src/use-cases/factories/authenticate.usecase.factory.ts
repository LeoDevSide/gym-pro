import PrismaUsersRepository from '../../repositories/prisma/prisma-users.repository'
import { AuthenticateUseCase } from '../authenticate.usecase'

export default class AuthUseCaseFactory {
  static create() {
    const userRepository = new PrismaUsersRepository()
    const authUseCase = new AuthenticateUseCase(userRepository)

    return authUseCase
  }
}
