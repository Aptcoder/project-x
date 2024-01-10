import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    BeforeInsert,
} from "typeorm"
import { UserToCompany } from "./user-to-company.entity"

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    firstName!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    lastName!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    password!: string

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
    })
    email!: string

    @OneToMany(() => UserToCompany, (u: UserToCompany) => u.user)
    public userToCompanies: UserToCompany[]

    @BeforeInsert()
    emailToLowercase() {
        this.email = this.email.toLowerCase()
    }

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    dateJoined!: Date
}
