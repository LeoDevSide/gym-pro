import { describe, it, expect, beforeEach } from 'vitest'
import InMemoryGymsRepository from '../repositories/in-memory/in-memory.gyms.repository'
import { SearchGymsUseCase } from './search-gyms.usecase'

let repository: InMemoryGymsRepository
let useCase: SearchGymsUseCase

describe('Get User Profile UseCase unit tests', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository()
    useCase = new SearchGymsUseCase(repository)
  })
  it('Should be able to get check ins by user id', async () => {
    await repository.create({
      title: 'search title test',
      latitude: 0,
      longitude: 0,
      description: '',
      phone: '',
    })
    await repository.create({
      title: 'search title test 2',
      latitude: 0,
      longitude: 0,
      description: '',
      phone: '',
    })

    const { gyms } = await useCase.execute({
      search: 'search title test',
      page: 1,
    })

    expect(gyms.length).toEqual(2)
    expect(gyms[1].title).toEqual('search title test 2')
    expect(gyms[1].id).toBeDefined()
  })
})
