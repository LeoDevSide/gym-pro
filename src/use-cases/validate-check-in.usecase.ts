import ICheckInRepository from '../repositories/check-in.repository.interface'
import { CheckIn } from '@prisma/client'
import CheckInNotFoundError from './errors/check-in-id-not-found.error'

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
    checkIn.validated_at = new Date()
    await this.checkInRepository.save(checkIn)
    return { checkIn }
  }
}
