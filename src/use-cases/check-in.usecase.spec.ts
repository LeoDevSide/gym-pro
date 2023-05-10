import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import InMemoryCheckInRepository from '../repositories/in-memory/in-memory-check-in.repository'
import CheckInUseCase from './check-in.usecase'
import UserAlreadyCheckInTodayError from './errors/already-check-in-today-error'

let repository: InMemoryCheckInRepository
let checkInUsecase: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInRepository()
    checkInUsecase = new CheckInUseCase(repository)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const { checkIn } = await checkInUsecase.execute({
      userId: 'user1',
      gymId: 'gym1',
    })

    expect(checkIn.id).toBeDefined()
    expect(checkIn.gym_id).toEqual('gym1')
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 1, 1, 1, 1))

    await checkInUsecase.execute({
      userId: 'user1',
      gymId: 'gym1',
    })

    await expect(() =>
      checkInUsecase.execute({
        userId: 'user1',
        gymId: 'gym1',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyCheckInTodayError)
  })
  it('should be able to check-in twice in diferent day', async () => {
    vi.setSystemTime(new Date(2023, 1, 3, 1, 1))

    const checkIn1 = await checkInUsecase.execute({
      userId: 'user2',
      gymId: 'gym1',
    })
    vi.setSystemTime(new Date(2023, 2, 3))

    const checkIn2 = await checkInUsecase.execute({
      userId: 'user2',
      gymId: 'gym1',
    })

    expect(checkIn2.checkIn.id).toBeDefined()
    expect(checkIn1.checkIn.id).toBeDefined()
  })
})
