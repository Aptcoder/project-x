import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"

import _ from "lodash"
import { Repository } from "typeorm"
import User from "../entities/user.entity"
import Company from "../entities/company.entity"
import { UserToCompany } from "src/entities/user-to-company.entity"
import { Role } from "../entities/role.entity"

@Service("role_service")
export default class RoleService {
    constructor(
        @Inject("role_repository") public roleRepository: Repository<Role>
    ) {}

    async getRoles(): Promise<Role[]> {
        return this.roleRepository.find()
    }
}
