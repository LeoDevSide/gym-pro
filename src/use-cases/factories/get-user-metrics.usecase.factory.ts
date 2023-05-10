import ICheckInRepository from '../../repositories/check-in.repository.interface'
import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins.repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export default class GetUserMetricsUseCaseFactory {
  static create() {
    const checkInsRepository: ICheckInRepository =
      new PrismaCheckInsRepository()
    const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)

    return getUserMetricsUseCase
  }
}
