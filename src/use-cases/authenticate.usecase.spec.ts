import { AuthenticateUseCase } from './authenticate.usecase'
import InMemoryUsersRepository from '../repositories/in-memory/in-memory-users.repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import InvalidCredentialsError from './errors/invalid-credentials.error'

let repository: InMemoryUsersRepository
let authUseCase: AuthenticateUseCase

describe('Auth UseCase unit tests', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    authUseCase = new AuthenticateUseCase(repository)
  })
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
