import { Prisma, User } from '@prisma/client'

export default interface IUsersRepository {
  create(userData: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
