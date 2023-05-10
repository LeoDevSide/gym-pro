import ICheckInRepository from '../../repositories/check-in.repository.interface'
import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins.repository'
import ValidateCheckInUseCase from '../validate-check-in.usecase'

export default class ValidateCheckInUseCaseFactory {
  static create() {
    const checkInsRepository: ICheckInRepository =
      new PrismaCheckInsRepository()
    const validateCheckInUseCase = new ValidateCheckInUseCase(
      checkInsRepository,
    )

    return validateCheckInUseCase
  }
}
