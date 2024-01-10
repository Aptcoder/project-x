import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    BeforeInsert,
} from "typeorm"
import _ from "lodash"
import { UserToCompany } from "./user-to-company.entity"
import { randomUUID } from "crypto"

@Entity()
export default class Company extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    companyName!: string

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
    })
    public slug: string

    @BeforeInsert()
    generateSlug() {
        this.slug = _.kebabCase(this.companyName.toLowerCase()) + randomUUID()
    }

    @OneToMany(() => UserToCompany, (u: UserToCompany) => u.company)
    public userToCompanies: UserToCompany[]
}
