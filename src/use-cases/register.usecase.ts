import { hash } from 'bcryptjs'
import IUsersRepository from '../repositories/users.repository.interface'
import UserAlreadyExistsError from './errors/user-already-exists.error'

type RegisterUseCaseDto = {
  name: string
  email: string
  password: string
}
export default class RegisterUseCase {
  private repository: IUsersRepository
  constructor(repository: IUsersRepository) {
    this.repository = repository
  }

  async execute(input: RegisterUseCaseDto) {
    const password_hash = await hash(input.password, 6)

    const userWithSameEmail = await this.repository.findByEmail(input.email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    await this.repository.create({
      name: input.name,
      email: input.email,
      password_hash,
    })
  }
}
