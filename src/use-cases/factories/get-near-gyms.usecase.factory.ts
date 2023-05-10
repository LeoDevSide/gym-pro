import IGymsRepository from '../../repositories/gyms-repository.interface'
import PrismaGymsRepository from '../../repositories/prisma/prisma-gyms.repository'
import { GetNearbyGymsUseCase } from '../get-near-gyms'

export default class GetNearGymUseCaseFactory {
  static create() {
    const gymRepository: IGymsRepository = new PrismaGymsRepository()
    const getNearbyGymsUseCase = new GetNearbyGymsUseCase(gymRepository)

    return getNearbyGymsUseCase
  }
}
