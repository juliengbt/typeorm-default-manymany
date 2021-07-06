import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm"
import { UsersObject } from './usersObject'

@Entity("User")
export class User {
  @PrimaryColumn({ type: 'varbinary', length: 16 })
    id!: Buffer

  @Column()
    name?: string

  @ManyToMany(() => UsersObject, (obj) => obj.id, { cascade: false })
  @JoinTable()
  objects!: UsersObject[]
}
