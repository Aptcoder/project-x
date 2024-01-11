import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import Company from "./company.entity"

export enum RoleType {
    custom = "custom",
    default = "default",
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn("uuid")
    public id: string

    @Column({
        nullable: true,
    })
    public companyId: string

    @ManyToOne(() => Company, (company) => company.userToCompanies)
    public company: Company

    @Column({})
    public name: string

    @Column({
        type: "enum",
        enum: RoleType,
        default: RoleType.default,
    })
    public type: RoleType

    @Column("text", { array: true })
    public permissions: string[]

    // @Column()
    // public : number
}
