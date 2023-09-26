import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { OTP } from "./entity/OTP"
import { Product } from "./entity/Product"

export const AppDataSource = new DataSource({
    type: "mongodb",
    database: "questfinal",
    synchronize: true,
    logging: false,
    entities: [User,OTP,Product],

})

AppDataSource.initialize().then(async () => {
    
}).catch(error => console.log(error))
