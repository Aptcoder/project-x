import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateSuperAdminDTO, CreateUserDTO } from "../common/dtos/user.dtos"
import Helper from "../common/helper"
import RoleService from "../services/role.service"
import { CreateRoleDTO } from "src/common/dtos/role.dtos"

@Service()
export default class RoleController {
    constructor(@Inject("role_service") public roleService: RoleService) {
        this.roleService = roleService
    }

    public async getAllRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params
            const roles = await this.roleService.getRoles(companyId)
            return Helper.formatResponse(res, "Roles", { roles })
        } catch (err: any) {
            return next(err)
        }
    }

    public async createCustomRole(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { companyId } = req.params
            const data: CreateRoleDTO = req.body
            const role = await this.roleService.createRole(data, companyId)
            return Helper.formatResponse(res, "Custom role created", { role })
        } catch (err) {
            return next(err)
        }
    }
}
