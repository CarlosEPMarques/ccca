import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository"
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection"
import GetRide from "../../src/application/usecase/GetRide"
import Registry from "../../src/infra/di/Registry"
import RequestRide from "../../src/application/usecase/RequestRide"
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository"
import Signup from "../../src/application/usecase/signup"

let databaseConnection: DatabaseConnection
let signup: Signup
let requestRide: RequestRide
let getRide: GetRide

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter()
    Registry.getInstance().provide('databaseConnection', databaseConnection)
    const accountRepository = new AccountRepositoryDatabase()
    const rideRepository = new RideRepositoryDatabase()
    Registry.getInstance().provide("accountRepository", accountRepository)
    Registry.getInstance().provide("rideRepository", rideRepository)
    signup = new Signup()
    getRide = new GetRide()
    requestRide = new RequestRide()

})

test('Should request an ride', async function () {
    const inputSignUp = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const outputSignup = await signup.execute(inputSignUp)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide)
    expect(outputRequestRide.rideId).toBeDefined()
    const outputGetRide = await getRide.execute(outputRequestRide.rideId)
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat)
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong)
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat)
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong)
    expect(outputGetRide.status).toBe('requested')
    expect(outputGetRide.fare).toBe(21)
    expect(outputGetRide.distance).toBe(10)
})

test('Should not request a ride if its not a passenger', async function () {
    const inputSignUp = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        carPlate: "AAA9999",
        isDriver: true
    }
    const outputSignup = await signup.execute(inputSignUp)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('The requester must be a passenger'))
})

test('Should not request a ride if passenger has a active ride', async function () {
    const inputSignUp = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const outputSignup = await signup.execute(inputSignUp)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide)
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('The requester already have an active ride'))
})

test('Should not request a ride if latitude and longitude are invalid', async function () {
    const inputSignUp = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'asdQWE123',
        isPassenger: true
    }
    const outputSignup = await signup.execute(inputSignUp)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -140,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('The latitude is invalid'))
})

afterEach(async () => {
    await databaseConnection.close()
})