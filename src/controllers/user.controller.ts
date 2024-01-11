import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateSuperAdminDTO, CreateUserDTO } from "../common/dtos/user.dtos"
import Helper from "../common/helper"
import UserService from "../services/user.service"

@Service()
export default class UserController {
    constructor(@Inject("user_service") public userService: UserService) {
        this.userService = userService
    }
    public async createAdminUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const createUserDto: CreateSuperAdminDTO = req.body
        try {
            const user = await this.userService.createSuperAdmin(createUserDto)
            return Helper.formatResponse(
                res,
                "Super admin created",
                {
                    user,
                },
                201
            )
        } catch (err: any) {
            return next(err)
        }
    }

    public async inviteUser(req: Request, res: Response, next: NextFunction) {
        const createUserDto: CreateUserDTO = req.body
        const { companyId } = req.params
        try {
            const user = await this.userService.createUser(
                createUserDto,
                companyId
            )
            return Helper.formatResponse(
                res,
                "User created",
                {
                    user,
                },
                201
            )
        } catch (err: any) {
            return next(err)
        }
    }

    public async authUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            const { accessToken, user } = await this.userService.auth({
                email,
                password,
            })
            return Helper.formatResponse(res, "User auth successful", {
                token: accessToken,
                user,
            })
        } catch (err) {
            return next(err)
        }
    }

    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getUsers()
            return Helper.formatResponse(res, "Users", { users })
        } catch (err: any) {
            return next(err)
        }
    }
}
