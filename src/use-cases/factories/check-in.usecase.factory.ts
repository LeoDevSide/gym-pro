import ICheckInRepository from '../../repositories/check-in.repository.interface'
import IGymsRepository from '../../repositories/gyms-repository.interface'
import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins.repository'
import PrismaGymsRepository from '../../repositories/prisma/prisma-gyms.repository'
import CheckInUseCase from '../check-in.usecase'

export default class RegisterUseCaseFactory {
  static create() {
    const checkInsRepository: ICheckInRepository =
      new PrismaCheckInsRepository()
    const gymRepository: IGymsRepository = new PrismaGymsRepository()
    const checkInUsecase = new CheckInUseCase(checkInsRepository, gymRepository)

    return checkInUsecase
  }
}
