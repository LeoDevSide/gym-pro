import ICheckInRepository from '../repositories/check-in.repository.interface'
import { CheckIn } from '@prisma/client'
import UserAlreadyCheckInTodayError from './errors/already-check-in-today-error'

type CheckInInputDto = {
  userId: string
  gymId: string
}
type CheckInOutputDto = {
  checkIn: CheckIn
}
export default class CheckInUseCase {
  private checkInRepository: ICheckInRepository
  constructor(checkInRepository: ICheckInRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute(input: CheckInInputDto): Promise<CheckInOutputDto> {
    const userAlreadyCheckInToday =
      await this.checkInRepository.findByUserIdOnDate(input.userId, new Date())
    if (userAlreadyCheckInToday) {
      throw new UserAlreadyCheckInTodayError()
    }
    const checkIn = await this.checkInRepository.create({
      user_id: input.userId,
      gym_id: input.gymId,
    })
    return { checkIn }
  }
}
