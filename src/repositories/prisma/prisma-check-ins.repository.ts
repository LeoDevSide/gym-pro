import { Prisma, CheckIn } from '@prisma/client'
import ICheckInRepository from '../check-in.repository.interface'
import { prisma } from '../../lib/prisma'
import { randomUUID } from 'crypto'

export class PrismaCheckInsRepository implements ICheckInRepository {
  async create(userData: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data: {
        id: userData.id ?? randomUUID(),
        created_at: new Date(),
        gym_id: userData.gym_id,
        user_id: userData.user_id,
      },
    })
    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          equals: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDay(),
          ),
        },
      },
    })
    return checkIn
  }

  async findByUserIdCheckins(
    userId: string,
    page: number,
  ): Promise<CheckIn[] | null> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }

  async findByCheckInId(checkInId: string): Promise<CheckIn | null> {
    const checkIn = prisma.checkIn.findUnique({
      where: { id: checkInId },
    })
    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInDb = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: {
        validated_at: checkIn.validated_at,
        gym_id: checkIn.gym_id,
        user_id: checkIn.user_id,
        created_at: checkIn.created_at,
      },
    })
    return checkInDb
  }
}
