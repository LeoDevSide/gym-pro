import { CheckIn, Prisma } from '@prisma/client'

export default interface ICheckInRepository {
  create(userData: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
