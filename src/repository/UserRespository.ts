import { UserEntity } from "../entity/UserEntity"
import { AppDataSource } from "../db/db"

export const userRepository = AppDataSource.getRepository(UserEntity)