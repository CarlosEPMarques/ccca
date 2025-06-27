import crypto from 'crypto'
import { AccountRepositoryDatabase } from '../src/AccountRepository'
import Account from '../src/Account'

test('Must save a account', async function () {
    const accountRepository = new AccountRepositoryDatabase()
    const account = Account.create(
        'John Doe',
        `john.doe${Math.random()}@gmail.com`,
        '97456321558',
        'asdQWE123',
        "",
        true,
        false
    )
    await accountRepository.saveAccount(account)
    const accountByEmail = await accountRepository.getAccountByEmail(account.email)
    expect(accountByEmail!.name).toBe(account.name)
    expect(accountByEmail!.email).toBe(account.email)
    expect(accountByEmail!.cpf).toBe(account.cpf)
    expect(accountByEmail!.password).toBe(account.password)
    const accountById = await accountRepository.getAccountById(account.accountId)
    expect(accountById.name).toBe(account.name)
    expect(accountById.email).toBe(account.email)
    expect(accountById.cpf).toBe(account.cpf)
    expect(accountById.password).toBe(account.password)
})