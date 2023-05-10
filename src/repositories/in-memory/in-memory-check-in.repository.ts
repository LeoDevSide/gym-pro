import { randomUUID } from 'node:crypto'
import ICheckInRepository from '../check-in.repository.interface'
import { CheckIn, Prisma } from '@prisma/client'
export default class InMemoryCheckInRepository implements ICheckInRepository {
  public items: CheckIn[] = []
  async create(checkInData: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: checkInData.id ?? randomUUID(),
      created_at: new Date(),
      validated_at: checkInData.validated_at ? new Date() : null,
      user_id: checkInData.user_id,
      gym_id: checkInData.gym_id,
    }
    this.items.push(checkIn)
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = this.items.find((checkIn) => {
      return (
        checkIn.user_id === userId &&
        checkIn.created_at.getDay() === date.getDay() &&
        checkIn.created_at.getMonth() === date.getMonth() &&
        checkIn.created_at.getFullYear() === date.getFullYear()
      )
    })
    if (!checkIn) {
      return null
    }
    return checkIn
  }

  async findByUserIdCheckins(userId: string, page: number) {
    const checkIns = this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
    if (checkIns.length === 0) {
      return null
    }
    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = this.items.filter(
      (checkIn) => checkIn.user_id === userId,
    ).length
    return count
  }

  async findByCheckInId(checkInId: string) {
    const checkIn = this.items.find((checkIn) => checkIn.id === checkInId)
    if (!checkIn) {
      return null
    }
    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    } // findIndex returns -1 when not found
    return this.items[checkInIndex]
  }
}
