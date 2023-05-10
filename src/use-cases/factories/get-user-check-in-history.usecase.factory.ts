import ICheckInRepository from '../../repositories/check-in.repository.interface'
import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins.repository'
import { GetUserCheckInsUseCase } from '../get-user-check-in-history.usecase'

export default class GetUserCheckInsUseCaseFactory {
  static create() {
    const checkInsRepository: ICheckInRepository =
      new PrismaCheckInsRepository()
    const checkInUsecase = new GetUserCheckInsUseCase(checkInsRepository)

    return checkInUsecase
  }
}
