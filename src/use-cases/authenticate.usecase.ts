import { compare } from 'bcryptjs'
import IUsersRepository from '../repositories/users.repository.interface'
import { User } from '@prisma/client'
import InvalidCredentialsError from './errors/invalid-credentials.error'

type AuthenticateUseCaseInputDto = {
  email: string
  password: string
}

type AuthenticateUseCaseOutputDto = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute(
    input: AuthenticateUseCaseInputDto,
  ): Promise<AuthenticateUseCaseOutputDto> {
    const user = await this.usersRepository.findByEmail(input.email)
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatch = compare(input.password, user.password_hash)
    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }
    return { user }
  }
}
