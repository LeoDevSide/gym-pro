import { expect, describe, it, beforeEach } from 'vitest'

import CreateGymUseCase from './create-gym.usecase'
import InMemoryGymsRepository from '../repositories/in-memory/in-memory.gyms.repository'

let repository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(repository)
  })
  it('should be able to create a new gym', async () => {
    const { gym } = await createGymUseCase.execute({
      id: 'gym 1',
      title: 'gym title',
      phone: '',
      description: '',
      latitude: -23.4227649,
      longitude: -46.4660058,
    })

    expect(gym.id).toBeDefined()
    expect(gym.id).toEqual('gym 1')
    expect(gym.title).toEqual('gym title')
  })

  // it('should not be able to register with same email address', async () => {
  //   const email = 'test@example.com'
  //   await createGymUseCase.execute({
  //     name: 'John Doe',
  //     email,
  //     password: 'testpassword',
  //   })
  //   await expect(() =>
  //     createGymUseCase.execute({
  //       name: 'John Doe',
  //       email,
  //       password: 'testpassword',
  //     }),
  //   ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  // })
})
