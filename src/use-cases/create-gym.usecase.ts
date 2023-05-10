import { Gym } from '@prisma/client'
import IGymsRepository from '../repositories/gyms-repository.interface'
import { randomUUID } from 'crypto'

type CreateGymUseCaseInputDto = {
  id?: string
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}
type CreateGymUseCaseOutputDto = {
  gym: Gym
}
export default class CreateGymUseCase {
  private repository: IGymsRepository
  constructor(repository: IGymsRepository) {
    this.repository = repository
  }

  async execute(
    input: CreateGymUseCaseInputDto,
  ): Promise<CreateGymUseCaseOutputDto> {
    const gym = await this.repository.create({
      id: input.id ? input.id : randomUUID(),
      title: input.title,
      description: input.description ? input.description : null,
      phone: input.phone ? input.phone : null,
      latitude: input.latitude,
      longitude: input.longitude,
    })
    return { gym }
  }
}
