import pgp from 'pg-promise'

export default interface RideDAO {
    saveRide(ride: any): Promise<void>
    getRideById(rideId: string): Promise<any>
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>
}

export class RideDAODatabase implements RideDAO {
    async saveRide(ride: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query(
            "insert into ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [ride.rideId, ride.passengerId, ride.driverId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]);
        await connection.$pool.end();
    }

    async getRideById(rideId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return output
    }

    async hasActiveRideByPassengerId(passengerId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [output] = await connection.query("select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
        await connection.$pool.end();
        return !!output
    }
} 