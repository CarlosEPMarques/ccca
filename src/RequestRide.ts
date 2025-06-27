import AccountDAO from "./data";
import { inject } from "./Registry";
import crypto, { timingSafeEqual } from 'crypto'
import RideDAO from "./RideDAO";

export default class RequestRide {
    @inject('accountDAO')
    accountDAO!: AccountDAO
    @inject('rideDAO')
    rideDAO!: RideDAO


    async execute (input: Input): Promise<Output> {
        const account = await this.accountDAO.getAccountById(input.passengerId)
        if (!account || !account.is_passenger) throw new Error('The requester must be a passenger')
        const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(input.passengerId)
        if (hasActiveRide) throw new Error('The requester already have an active ride')
        if (input.fromLat < -90 || input.fromLat > 90) throw new Error('The latitude is invalid')
        if (input.fromLong < -180 || input.fromLong > 180) throw new Error('The longitude is invalid')
        if (input.toLat < -90 || input.toLat > 90) throw new Error('The latitude is invalid')
        if (input.toLong < -180 || input.toLong > 180) throw new Error('The longitude is invalid')
        const ride = {
            rideId: crypto.randomUUID(),
            passengerId: input.passengerId,
            fromLat: input.fromLat,
            fromLong: input.fromLong,
            toLat: input.toLat,
            toLong: input.toLong,
            fare: 0,
            distance: 0,
            status: 'requested',
            date: new Date()

        }
        await this.rideDAO.saveRide(ride)
        return {
            rideId: ride.rideId
        }
    }
}

type Input = {
    passengerId: string,
    fromLat: number, 
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}