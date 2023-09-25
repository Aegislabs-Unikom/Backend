import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { OTP } from "./entity/OTP"

export const AppDataSource = new DataSource({
    type: "mongodb",
    database: "questfinal",
    url: "mongodb://zulnurdiana:0GCkJ5UJPfuA4N8A@ac-dr9rqg0-shard-00-00.w67zqzg.mongodb.net:27017,ac-dr9rqg0-shard-00-01.w67zqzg.mongodb.net:27017,ac-dr9rqg0-shard-00-02.w67zqzg.mongodb.net:27017/?ssl=true&replicaSet=atlas-ial56o-shard-0&authSource=admin&retryWrites=true&w=majority",
    synchronize: true,
    logging: false,
    entities: [User,OTP],

})

AppDataSource.initialize().then(async () => {
}).catch(error => console.log(error))
