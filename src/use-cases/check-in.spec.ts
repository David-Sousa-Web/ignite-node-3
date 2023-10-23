import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistError } from './errors/user-already-exists'
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { string } from 'zod'

let checkInRepository: InMemoryCheckinsRepository
let sut: CheckInUseCase

describe('Register Use Case', () => {
  beforeEach(()=> {
    checkInRepository = new InMemoryCheckinsRepository()
    sut = new CheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(()=> {
    vi.useRealTimers()
  })


  it('Should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  
  })

  //red, green, refactory vindo do TDD -> Test Driven Development
  it("should not be able to check in twice in the same day", async ()=> {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0))
    
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
    })

    await expect(()=> 
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it("should not be able to check in twice but in different days", async ()=> {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0))
    
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
    }) 

    expect(checkIn).toEqual(expect.any(string))
  })
})