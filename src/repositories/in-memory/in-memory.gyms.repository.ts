import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import IGymsRepository from '../gyms-repository.interface'
import { Decimal } from '@prisma/client/runtime'
export default class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async create(gymData: Prisma.GymCreateInput) {
    const gym = {
      id: gymData.id ? gymData.id : randomUUID(),
      title: gymData.title,
      description: gymData.description ? gymData.description : null,
      phone: gymData.phone ? gymData.phone : null,
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    }
    this.items.push(gym)
    return gym
  }

  async findById(id: string) {
    console.log(id)
    const gym = this.items.find((item) => item.id === id)
    if (!gym) {
      return null
    }
    return gym
  }
}
