import ICheckInRepository from '../repositories/check-in.repository.interface'
import { CheckIn } from '@prisma/client'
import CheckInNotFoundError from './errors/check-in-id-not-found.error'
import CheckInExpiredError from './errors/check-in-expired.error'

type ValidateCheckInInputDto = {
  checkInId: string
}
type ValidateCheckInOutputDto = {
  checkIn: CheckIn
}
export default class ValidateCheckInUseCase {
  constructor(private checkInRepository: ICheckInRepository) {}

  async execute(
    input: ValidateCheckInInputDto,
  ): Promise<ValidateCheckInOutputDto> {
    const checkIn = await this.checkInRepository.findByCheckInId(
      input.checkInId,
    )
    if (!checkIn) {
      throw new CheckInNotFoundError()
    }
    const now = new Date()
    const checkInIsExpired =
      checkIn.created_at.getFullYear() === now.getFullYear() &&
      checkIn.created_at.getMonth() === now.getMonth() &&
      checkIn.created_at.getDay() === now.getDay() &&
      now.getMinutes() - checkIn.created_at.getMinutes() >= 20

    if (checkInIsExpired) {
      throw new CheckInExpiredError()
    }
    checkIn.validated_at = now
    await this.checkInRepository.save(checkIn)
    return { checkIn }
  }
}
