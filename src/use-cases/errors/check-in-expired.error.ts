export default class CheckInExpiredError extends Error {
  constructor() {
    super('Check in expired')
  }
}
