import IUsersRepository from '../users.repository.interface'
import { Prisma, User } from '@prisma/client'
export default class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []
  async create(userData: Prisma.UserCreateInput) {
    const user = {
      id: 'user1',
      name: userData.name,
      email: userData.email,
      password_hash: userData.password_hash,
      created_at: new Date(),
    }
    this.items.push(user)
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)
    if (!user) {
      return null
    }
    return user
  }
}
