import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import IGymsRepository from '../gyms-repository.interface'

export default class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async create(gymData: Prisma.GymCreateInput) {
    const gym = {
      id: gymData.id ? gymData.id : randomUUID(),
      title: gymData.title,
      description: gymData.description ? gymData.description : null,
      phone: gymData.phone ? gymData.phone : null,
      latitude: new Prisma.Decimal(gymData.latitude.toString()),
      longitude: new Prisma.Decimal(gymData.longitude.toString()),
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
