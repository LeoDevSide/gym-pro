import { Prisma, Gym } from '@prisma/client'
import IGymsRepository, {
  FindManyNearbyParams,
} from '../gyms-repository.interface'
import { prisma } from '../../lib/prisma'
import { randomUUID } from 'crypto'

export default class PrismaGymsRepository implements IGymsRepository {
  async create(gymData: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data: {
        latitude: gymData.latitude,
        longitude: gymData.longitude,
        title: gymData.title,
        phone: gymData.phone ?? null,
        description: gymData.description ?? null,
        id: gymData.id ?? randomUUID(),
      },
    })
    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })
    return gym
  }

  async searchManyByTitle(title: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
`
    return gyms
  }
}
