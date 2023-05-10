import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import InMemoryCheckInRepository from '../repositories/in-memory/in-memory-check-in.repository'
import ValidateCheckInUseCase from './validate-check-in.usecase'
import CheckInNotFoundError from './errors/check-in-id-not-found.error'
import CheckInExpiredError from './errors/check-in-expired.error'

let checkInRepository: InMemoryCheckInRepository
let useCase: ValidateCheckInUseCase

describe('Validate CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    useCase = new ValidateCheckInUseCase(checkInRepository)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to validate check in', async () => {
    vi.setSystemTime(new Date(2023, 1, 1, 1, 1))
    checkInRepository.create({
      gym_id: 'gym1',
      user_id: 'user1',
      id: 'checkIn1',
    })
    const { checkIn } = await useCase.execute({
      checkInId: 'checkIn1',
    })

    expect(checkIn.id).toBeDefined()
    expect(checkIn.id).toEqual('checkIn1')
    expect(checkIn.validated_at).toBeDefined()
    expect(checkIn.validated_at).toEqual(new Date(2023, 1, 1, 1, 1))

    expect(checkIn.gym_id).toEqual('gym1')
    expect(checkIn.user_id).toEqual('user1')
  })
  it('checkIn should not be validated after 20 minutes', async () => {
    vi.setSystemTime(new Date(2023, 1, 1, 1, 1))
    checkInRepository.create({
      gym_id: 'gym1',
      user_id: 'user1',
      id: 'checkIn3',
    })
    vi.setSystemTime(new Date(2023, 1, 1, 1, 21))

    await expect(() =>
      useCase.execute({
        checkInId: 'checkIn3',
      }),
    ).rejects.toBeInstanceOf(CheckInExpiredError)
  })
  it('should throw a error if the checkIn id is not found', async () => {
    await expect(
      useCase.execute({
        checkInId: 'checkIn2',
      }),
    ).rejects.toBeInstanceOf(CheckInNotFoundError)
  })
})
