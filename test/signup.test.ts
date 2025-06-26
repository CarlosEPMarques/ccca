import sinon from "sinon"
import { AccountDAODatabase, AccountDAOMemory } from "../src/data"
import GetAccount from "../src/getAccount"
import Signup from "../src/signup"
import Registry from "../src/Registry"

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
    const accountDAO = new AccountDAODatabase()
    //const accountDAO = new AccountDAOMemory()
    Registry.getInstance().provide("accountDAO", accountDAO)
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

    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, 'saveAccount').resolves()
    const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, 'getAccountByEmail').resolves()
    const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, 'getAccountById').resolves(input)
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
    const saveAccountSpy = sinon.spy(AccountDAODatabase.prototype, 'saveAccount')
    const getAccountByIdSpy = sinon.spy(AccountDAODatabase.prototype, 'getAccountById')

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
    
    const accountDAOMock = sinon.mock(AccountDAODatabase.prototype)
    accountDAOMock.expects('saveAccount').once().resolves()
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    accountDAOMock.expects('getAccountById').once().withArgs(outputSignup.accountId).resolves(input)
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.password).toBe(input.password)
    accountDAOMock.verify()
    accountDAOMock.restore()
})

test('FAKE - Must create a Passenger account', async function() {
    const accountDAO = new AccountDAOMemory()
    Registry.getInstance().provide("accountDAO", accountDAO)
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