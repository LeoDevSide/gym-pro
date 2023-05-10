import { Gym } from '@prisma/client'
import IGymsRepository from '../repositories/gyms-repository.interface'

interface GetNearbyGymsUseCaseInputDto {
  userLatitude: number
  userLongitude: number
}

interface GetNearbyGymsUseCaseOutputDto {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: GetNearbyGymsUseCaseInputDto): Promise<GetNearbyGymsUseCaseOutputDto> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
