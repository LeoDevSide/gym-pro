import { describe, it, expect, beforeEach } from 'vitest'
import InMemoryCheckInRepository from '../repositories/in-memory/in-memory-check-in.repository'
import { GetUserCheckInsUseCase } from './get-user-check-in-history.usecase'
import UserCheckInsNotFoundError from './errors/user-check-ins-not-found'

let repository: InMemoryCheckInRepository
let getUserCheckInsUseCase: GetUserCheckInsUseCase

describe('Get User Profile UseCase unit tests', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    getUserCheckInsUseCase = new GetUserCheckInsUseCase(repository)
  })
  it('Should be able to get check ins by user id', async () => {
    await repository.create({
      gym_id: 'gym1',
      user_id: 'user1',
    })
    await repository.create({
      gym_id: 'gym1',
      user_id: 'user1',
    })
    await repository.create({
      gym_id: 'gym1',
      user_id: 'user1',
    })
    const { checkIns } = await getUserCheckInsUseCase.execute({
      userId: 'user1',
      page: 1,
    })

    expect(checkIns.length).toEqual(3)
    expect(checkIns[1].gym_id).toEqual('gym1') // initial user id from memory repository
    expect(checkIns[1].user_id).toEqual('user1') // initial user id from memory repository
    expect(checkIns[1].id).toBeDefined() // initial user id from memory repository
  })

  it('Should be able to get paginated check-in history by user ID', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create({
        gym_id: `gym${i}`,
        user_id: 'user1',
      })
    }
    const { checkIns } = await getUserCheckInsUseCase.execute({
      userId: 'user-1',
      page: 2,
    })
    expect(checkIns[0].gym_id).toEqual('gym1')
    expect(checkIns[21].gym_id).toEqual('gym22')
    expect(checkIns.length).toEqual(2)
  })

  it('Should throw user id not found error when Idis not found', async () => {
    await expect(() =>
      getUserCheckInsUseCase.execute({
        userId: 'user322',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(UserCheckInsNotFoundError)
  })
})
