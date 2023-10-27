import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'


let checkInRepository: InMemoryCheckinsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Register Use Case', () => {
  beforeEach(()=> {
    checkInRepository = new InMemoryCheckinsRepository()
    gymsRepository = new InMemoryGymsRepository
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

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
      userLatitude: 0,
      userLogintude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  
  })

  //red, green, refactory vindo do TDD -> Test Driven Development
  it("should not be able to check in twice in the same day", async ()=> {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0))
    
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: 0,
      userLogintude: 0,
    })

    await expect(()=> 
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-id',
        userLatitude: 0,
        userLogintude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it("should be able to check in twice but in different days", async ()=> {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0))
    
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: 0,
      userLogintude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: 0,
      userLogintude: 0,
    }) 

    expect(checkIn.id).toEqual(expect.any(String))
  })
})