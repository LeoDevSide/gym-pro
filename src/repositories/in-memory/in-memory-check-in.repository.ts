import { randomUUID } from 'node:crypto'
import ICheckInRepository from '../check-in.repository.interface'
import { CheckIn, Prisma } from '@prisma/client'
export default class InMemoryCheckInRepository implements ICheckInRepository {
  public items: CheckIn[] = []
  async create(checkInData: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
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
}
