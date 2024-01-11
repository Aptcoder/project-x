import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"

import _ from "lodash"
import { Or, Repository } from "typeorm"
import User from "../entities/user.entity"
import Company from "../entities/company.entity"
import { UserToCompany } from "src/entities/user-to-company.entity"
import { Role, RoleType } from "../entities/role.entity"
import { CreateRoleDTO } from "src/common/dtos/role.dtos"

@Service("role_service")
export default class RoleService {
    constructor(
        @Inject("role_repository") public roleRepository: Repository<Role>
    ) {}

    async getRoles(companyId: string): Promise<Role[]> {
        return this.roleRepository.find({
            where: [
                { type: RoleType.custom, companyId: companyId },
                { type: RoleType.default },
            ],
        })
    }

    async createRole(data: CreateRoleDTO, companyId: string) {
        let role = new Role()
        role.companyId = companyId
        role.name = data.name
        role.permissions = data.permissions
        role.type = RoleType.custom

        role = await this.roleRepository.save(role)
        return role
    }
}
