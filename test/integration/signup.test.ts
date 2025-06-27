import sinon from "sinon"
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../../src/infra/repository/AccountRepository"
import GetAccount from "../../src/application/usecase/GetAccount"
import Signup from "../../src/application/usecase/signup"
import Registry from "../../src/infra/di/Registry"
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection"

let databaseConnection: DatabaseConnection
let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter()
    Registry.getInstance().provide('databaseConnection', databaseConnection)
    const accountRepository = new AccountRepositoryDatabase()
    //const accountRepository = new AccountRepositoryMemory()
    Registry.getInstance().provide("accountRepository", accountRepository)
    signup = new Signup()
    getAccount = new GetAccount()
})

test('Must create a Passenger account', async function() {

    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()

    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
})

test('Must create a Driver account', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isDriver: true,
        carPlate: 'AAA9999'
    }
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()

    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
})

test('Should not create a Passenger account if name is invalid', async function() {
    const input = {
        name: 'John',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid name'))
})

test('Should not create a Passenger account if email is invalid', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid email'))

})

test('Should not create a Passenger account if CPF is invalid', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '11111111111',
        password: 'asdQWE123',
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid CPF'))

})

test('Should not create a Passenger account if password is invalid', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE',
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid password'))

})

test('Should not create a Passenger account if account is duplicated', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error('Account already exists'))

})

test('Should not create a Driver account if car plate is invalid', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isDriver: true,
        carPlate: 'AAA999'
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid car plate'))

})

// Test Patterns

test('STUB - Must create a Passenger account', async function() {
    const input: any = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, 'saveAccount').resolves()
    const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, 'getAccountByEmail').resolves()
    const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, 'getAccountById').resolves(input)
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()

    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
    saveAccountStub.restore()
    getAccountByEmailStub.restore()
    getAccountByIdStub.restore()
})

test('SPY - Must create a Passenger account', async function() {
    const saveAccountSpy = sinon.spy(AccountRepositoryDatabase.prototype, 'saveAccount')
    const getAccountByIdSpy = sinon.spy(AccountRepositoryDatabase.prototype, 'getAccountById')

    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()

    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
    expect(saveAccountSpy.calledOnce).toBeTruthy()
    expect(getAccountByIdSpy.calledOnceWith(outputSignup.accountId)).toBeTruthy()
    saveAccountSpy.restore()
    getAccountByIdSpy.restore()
})

test('MOCK - Must create a Passenger account', async function() {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    
    const accountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype)
    accountRepositoryMock.expects('saveAccount').once().resolves()
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    accountRepositoryMock.expects('getAccountById').once().withArgs(outputSignup.accountId).resolves(input)
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
    accountRepositoryMock.verify()
    accountRepositoryMock.restore()
})

test('FAKE - Must create a Passenger account', async function() {
    const accountRepository = new AccountRepositoryMemory()
    Registry.getInstance().provide("accountRepository", accountRepository)
    signup = new Signup()
    getAccount = new GetAccount()
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    

    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
})

afterEach(async () => {
    await databaseConnection.close()
})