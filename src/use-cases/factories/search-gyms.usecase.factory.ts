import IGymsRepository from '../../repositories/gyms-repository.interface'
import PrismaGymsRepository from '../../repositories/prisma/prisma-gyms.repository'
import { SearchGymsUseCase } from '../search-gyms.usecase'

export default class SearchGymsUseCaseFactory {
  static create() {
    const gymRepository: IGymsRepository = new PrismaGymsRepository()
    const searchGymsUseCase = new SearchGymsUseCase(gymRepository)

    return searchGymsUseCase
  }
}
