export default class UserAlreadyExistsError extends Error {
  constructor() {
    super('Email already exists')
  }
}
