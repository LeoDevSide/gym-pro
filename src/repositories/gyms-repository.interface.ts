import { Gym, Prisma } from '@prisma/client'

export default interface IGymsRepository {
  create(gymData: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  searchManyByTitle(title: string, page: number): Promise<Gym[]>
}
