import { Gym } from '@prisma/client'
import IGymsRepository from '../repositories/gyms-repository.interface'

type SearchGymsInputDto = {
  search: string
  page: number
}

type SearchGymsOutputDto = {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}
  async execute(input: SearchGymsInputDto): Promise<SearchGymsOutputDto> {
    const gyms = await this.gymsRepository.searchManyByTitle(
      input.search,
      input.page,
    )

    return { gyms }
  }
}
