import { CheckIn } from '@prisma/client'
import ICheckInRepository from '../repositories/check-in.repository.interface'
import UserCheckInsNotFoundError from './errors/user-check-ins-not-found'

type GetUserCheckinsInputDto = {
  userId: string
  page: number
}

type GetUserCheckinsOutputDto = {
  checkIns: CheckIn[]
}

export class GetUserCheckInsUseCase {
  constructor(private usersRepository: ICheckInRepository) {}
  async execute(
    input: GetUserCheckinsInputDto,
  ): Promise<GetUserCheckinsOutputDto> {
    const checkIns = await this.usersRepository.findByUserIdCheckins(
      input.userId,
      input.page,
    )
    if (!checkIns) {
      throw new UserCheckInsNotFoundError()
    }

    return { checkIns }
  }
}
