import IGymsRepository from '../../repositories/gyms-repository.interface'
import PrismaGymsRepository from '../../repositories/prisma/prisma-gyms.repository'
import CreateGymUseCase from '../create-gym.usecase'

export default class CreateGymUseCaseFactory {
  static create() {
    const gymRepository: IGymsRepository = new PrismaGymsRepository()
    const createGymUseCase = new CreateGymUseCase(gymRepository)

    return createGymUseCase
  }
}
