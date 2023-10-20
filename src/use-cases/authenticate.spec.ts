import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'

describe('Authenticate Use Case', () => {
  it('Should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)
      
    const { user } = await authenticateUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
  
})