import ICheckInRepository from '../repositories/check-in.repository.interface'
import { CheckIn } from '@prisma/client'
import UserAlreadyCheckInTodayError from './errors/already-check-in-today-error'
import IGymsRepository from '../repositories/gyms-repository.interface'
import GymIdNotFoundError from './errors/gym-id-not-found.error'
import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from './utils/get-distance-between-coordenates'
import UserIsNotFarError from './errors/user-is-not-far'

type CheckInInputDto = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}
type CheckInOutputDto = {
  checkIn: CheckIn
}
export default class CheckInUseCase {
  private checkInRepository: ICheckInRepository
  private gymsRepository: IGymsRepository
  constructor(
    checkInRepository: ICheckInRepository,
    gymsRepository: IGymsRepository,
  ) {
    this.checkInRepository = checkInRepository
    this.gymsRepository = gymsRepository
  }

  async execute(input: CheckInInputDto): Promise<CheckInOutputDto> {
    const gym = await this.gymsRepository.findById(input.gymId)
    if (!gym) {
      throw new GymIdNotFoundError()
    }
    const gymCoord: Coordinate = {
      latitude: Number(gym.latitude),
      longitude: Number(gym.longitude),
    }
    const userCoord: Coordinate = {
      latitude: input.userLatitude,
      longitude: input.userLongitude,
    }
    const userDistance = getDistanceBetweenCoordinates(gymCoord, userCoord)
    // calculate distance between gym and user
    const MAX_DISTANCE_IN_KM = 0.1
    const userDistanceIsMoreThan100m = userDistance > MAX_DISTANCE_IN_KM
    if (userDistanceIsMoreThan100m) {
      throw new UserIsNotFarError()
    }
    const userAlreadyCheckInToday =
      await this.checkInRepository.findByUserIdOnDate(input.userId, new Date())
    if (userAlreadyCheckInToday) {
      throw new UserAlreadyCheckInTodayError()
    }

    const checkIn = await this.checkInRepository.create({
      user_id: input.userId,
      gym_id: input.gymId,
    })
    return { checkIn }
  }
}
