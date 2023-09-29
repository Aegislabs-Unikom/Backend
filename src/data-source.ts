import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User.entity"
import { OTP } from "./entity/OTP.entity"
import { Product } from "./entity/Product.entity"
import { Category } from "./entity/Category.entity"

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: "mongodb://zulnurdiana:0GCkJ5UJPfuA4N8A@ac-dr9rqg0-shard-00-00.w67zqzg.mongodb.net:27017,ac-dr9rqg0-shard-00-01.w67zqzg.mongodb.net:27017,ac-dr9rqg0-shard-00-02.w67zqzg.mongodb.net:27017/?ssl=true&replicaSet=atlas-ial56o-shard-0&authSource=admin&retryWrites=true&w=majority",
    database: "questfinal",
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../**/*.entity.{js,ts}']

})




export const Manager = AppDataSource.manager;