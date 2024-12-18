import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn() 
  id: number
  @Column()
  nickname: String
  @Column()
  phoneNumberId: String
  @Column()
  accessToken: String
}