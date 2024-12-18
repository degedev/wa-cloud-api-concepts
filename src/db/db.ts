import { DataSource } from "typeorm"
import { UserEntity } from "../entity/UserEntity"

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [UserEntity],
  migrations: [],
  subscribers: [],
})

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!")
  })
  .catch((error) => console.log("Error: ", error))
