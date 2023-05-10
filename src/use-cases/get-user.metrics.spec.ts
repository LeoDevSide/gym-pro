import { describe, it, expect, beforeEach } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import InMemoryCheckInRepository from '../repositories/in-memory/in-memory-check-in.repository'

let repository: InMemoryCheckInRepository
let getUserMetrics: GetUserMetricsUseCase

describe('Get User Metrics UseCase unit tests', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    getUserMetrics = new GetUserMetricsUseCase(repository)
  })
  it('Should be able to get user check ins Metrics', async () => {
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
    const { checkInsCount } = await getUserMetrics.execute({
      userId: 'user1',
    })

    expect(checkInsCount).toEqual(3)
  })
})
