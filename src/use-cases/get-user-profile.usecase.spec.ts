import InMemoryUsersRepository from '../repositories/in-memory/in-memory-users.repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile.usecase'
import UserIdNotFoundError from './errors/user-id-not-found.error'

let repository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile UseCase unit tests', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(repository)
  })
  it('Should be able to get user by id', async () => {
    await repository.create({
      id: 'user1',
      name: 'John Doe',
      email: 'test@example.com',
      password_hash: await hash('testpassword', 6),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: 'user1',
    })

    expect(user.id).toBeDefined()
    expect(user.id).toEqual('user1') // initial user id from memory repository
    expect(user.name).toEqual('John Doe')
  })

  it('Should throw user id not found error when Idis not found', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'user2',
      }),
    ).rejects.toBeInstanceOf(UserIdNotFoundError)
  })
})
