import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import IUsersRepository from '../users.repository.interface'
export default class PrismaUsersRepository implements IUsersRepository {
  async create(userData: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password_hash: userData.password_hash,
      },
    })
    return user
  }

  async findByEmail(email: string) {
    const search = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return search
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }
}
