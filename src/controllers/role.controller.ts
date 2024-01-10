import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateSuperAdminDTO, CreateUserDTO } from "../common/dtos/user.dtos"
import Helper from "../common/helper"
import RoleService from "../services/role.service"

@Service()
export default class RoleController {
    constructor(@Inject("role_service") public roleService: RoleService) {
        this.roleService = roleService
    }

    public async getAllRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await this.roleService.getRoles()
            return Helper.formatResponse(res, "Roles", { roles })
        } catch (err: any) {
            return next(err)
        }
    }
}
