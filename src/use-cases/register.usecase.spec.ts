import { expect, describe, it, beforeEach } from 'vitest'
import RegisterUseCase from './register.usecase'
import { compare } from 'bcryptjs'
import InMemoryUsersRepository from '../repositories/in-memory/in-memory-users.repository'
import UserAlreadyExistsError from './errors/user-already-exists.error'

let repository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(repository)
  })
  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'testpassword',
    })

    expect(user.id).toBeDefined()
    expect(user.name).toEqual('John Doe')
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'testpassword',
    })

    const isPasswordCorrectHashed = await compare(
      'testpassword',
      user.password_hash,
    )

    expect(isPasswordCorrectHashed === true)
  })

  it('should not be able to register with same email address', async () => {
    const email = 'test@example.com'
    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: 'testpassword',
    })
    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: 'testpassword',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
