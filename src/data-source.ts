import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { OTP } from "./entity/OTP"

export const AppDataSource = new DataSource({
    type: "mongodb",
    database: "questfinal",
    synchronize: true,
    logging: false,
    entities: [User,OTP],

})

AppDataSource.initialize().then(async () => {
}).catch(error => console.log(error))
