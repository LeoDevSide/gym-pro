export default class UserAlreadyCheckInTodayError extends Error {
  constructor() {
    super('User already checked-in today')
  }
}
