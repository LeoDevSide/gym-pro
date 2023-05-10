import PrismaUsersRepository from '../../repositories/prisma/prisma-users.repository'
import IUsersRepository from '../../repositories/users.repository.interface'
import { GetUserProfileUseCase } from '../get-user-profile.usecase'

export default class GetUserProfileeUseCaseFactory {
  static create() {
    const usersRepository: IUsersRepository = new PrismaUsersRepository()
    const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)

    return getUserProfileUseCase
  }
}
