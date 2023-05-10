export default class CheckInNotFoundError extends Error {
  constructor() {
    super(' Check In id Not Found')
  }
}
