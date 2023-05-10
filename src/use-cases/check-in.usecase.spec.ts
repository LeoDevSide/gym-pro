import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import InMemoryCheckInRepository from '../repositories/in-memory/in-memory-check-in.repository'
import CheckInUseCase from './check-in.usecase'
import UserAlreadyCheckInTodayError from './errors/already-check-in-today-error'
import InMemoryGymsRepository from '../repositories/in-memory/in-memory.gyms.repository'
import { Decimal } from '@prisma/client/runtime'
import UserIsNotFarError from './errors/user-is-not-far'

let checkInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let checkInUsecase: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUsecase = new CheckInUseCase(checkInRepository, gymsRepository)
    vi.useFakeTimers()

    gymsRepository.items.push({
      id: 'gym1',
      title: 'gym title',
      description: 'a',
      phone: 'a',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const { checkIn } = await checkInUsecase.execute({
      userId: 'user1',
      gymId: 'gym1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toBeDefined()
    expect(checkIn.gym_id).toEqual('gym1')
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 1, 1, 1, 1))

    await checkInUsecase.execute({
      userId: 'user1',
      gymId: 'gym1',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      checkInUsecase.execute({
        userId: 'user1',
        gymId: 'gym1',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyCheckInTodayError)
  })

  it('should not be able to check-in from a distant loc', async () => {
    vi.setSystemTime(new Date(2023, 1, 2, 1, 1))

    gymsRepository.items.push({
      id: 'gym2',
      title: 'gym title',
      description: 'a',
      phone: 'a',
      latitude: new Decimal(-23.4227649),
      longitude: new Decimal(-46.4660058),
    })

    await expect(() =>
      checkInUsecase.execute({
        userId: 'user1',
        gymId: 'gym2',
        userLatitude: -23.4443397,
        userLongitude: -46.5066264,
      }),
    ).rejects.toBeInstanceOf(UserIsNotFarError)
  })
  it('should be able to check-in twice in diferent day', async () => {
    vi.setSystemTime(new Date(2023, 1, 3, 1, 1))

    const checkIn1 = await checkInUsecase.execute({
      userId: 'user1',
      gymId: 'gym1',
      userLatitude: 0,
      userLongitude: 0,
    })
    vi.setSystemTime(new Date(2023, 2, 3))

    const checkIn2 = await checkInUsecase.execute({
      userId: 'user1',
      gymId: 'gym1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn2.checkIn.id).toBeDefined()
    expect(checkIn1.checkIn.id).toBeDefined()
  })
})
