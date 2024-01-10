import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    BaseEntity,
    PrimaryColumn,
} from "typeorm"
import Company from "./company.entity"
import User from "./user.entity"
import { Role } from "./role.entity"

@Entity()
export class UserToCompany extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string

    @PrimaryColumn()
    public companyId: string

    @PrimaryColumn()
    public userId: string

    @Column()
    public roleId: string

    @ManyToOne(() => Role)
    public role: Role

    @ManyToOne(() => Company, (company) => company.userToCompanies)
    public company: Company

    @ManyToOne(() => User, (user) => user.userToCompanies)
    public user: User
}
