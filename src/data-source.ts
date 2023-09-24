import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mongodb",
    database: "questfinal",
    synchronize: true,
    logging: false,
    entities: [User],

})

AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!")
}).catch(error => console.log(error))
