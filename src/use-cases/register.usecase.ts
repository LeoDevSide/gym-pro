import { hash } from 'bcryptjs'
import IUsersRepository from '../repositories/users.repository.interface'
import UserAlreadyExistsError from './errors/user-already-exists.error'
import { User } from '@prisma/client'

type RegisterUseCaseInputDto = {
  name: string
  email: string
  password: string
}
interface RegisterUseCaseOutputDto {
  user: User
}
export default class RegisterUseCase {
  private repository: IUsersRepository
  constructor(repository: IUsersRepository) {
    this.repository = repository
  }

  async execute(
    input: RegisterUseCaseInputDto,
  ): Promise<RegisterUseCaseOutputDto> {
    const password_hash = await hash(input.password, 6)

    const userWithSameEmail = await this.repository.findByEmail(input.email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const user = await this.repository.create({
      name: input.name,
      email: input.email,
      password_hash,
    })
    return { user }
  }
}
