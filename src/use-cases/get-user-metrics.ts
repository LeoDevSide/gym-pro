import ICheckInRepository from '../repositories/check-in.repository.interface'

type GetUserMetricsInputDto = {
  userId: string
}

type GetUserMetricsOutputDto = {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInRepository) {}
  async execute(
    input: GetUserMetricsInputDto,
  ): Promise<GetUserMetricsOutputDto> {
    const checkInsCount = await this.checkInsRepository.countByUserId(
      input.userId,
    )

    return { checkInsCount }
  }
}
