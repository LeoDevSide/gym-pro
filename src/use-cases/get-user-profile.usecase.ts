import IUsersRepository from '../repositories/users.repository.interface'
import { User } from '@prisma/client'
import UserIdNotFoundError from './errors/user-id-not-found.error'

type GetUserProfileInputDto = {
  userId: string
}

type GetUserProfileOutputDto = {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute(
    input: GetUserProfileInputDto,
  ): Promise<GetUserProfileOutputDto> {
    const user = await this.usersRepository.findById(input.userId)
    if (!user) {
      throw new UserIdNotFoundError()
    }

    return { user }
  }
}
