import { AuthenticateUseCase } from './authenticate.usecase'
import InMemoryUsersRepository from '../repositories/in-memory/in-memory-users.repository'
import { describe, it, expect } from 'vitest'
import { hash } from 'bcryptjs'
import InvalidCredentialsError from './errors/invalid-credentials.error'

const repository = new InMemoryUsersRepository()
const authUseCase = new AuthenticateUseCase(repository)

describe('Auth UseCase unit tests', () => {
  it('Should be able to authenticate', async () => {
    await repository.create({
      name: 'John Doe',
      email: 'test@example.com',
      password_hash: await hash('testpassword', 6),
    })

    const { user } = await authUseCase.execute({
      email: 'test@example.com',
      password: 'testpassword',
    })

    expect(user.id).toBeDefined()
    expect(user.name).toEqual('John Doe')
  })

  it('Should throw invalid credential error when email not found', async () => {
    await expect(() =>
      authUseCase.execute({
        email: 'tesat@example.com',
        password: 'testp2assword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should throw invalid credential error when password is wrong', async () => {
    await repository.create({
      name: 'John Doe2',
      email: 'test2@example.com',
      password_hash: await hash('testpassword', 6),
    })

    await expect(() =>
      authUseCase.execute({
        email: 'test@example.com',
        password: 'testp2assword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
