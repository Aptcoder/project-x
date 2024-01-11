import { Router } from "express"
import UserController from "../controllers/user.controller"
import { IContainer } from "../common/types"
import validator from "../middlewares/validator"
import {
    AuthUserDto,
    CreateSuperAdminDTO,
    CreateUserDTO,
} from "../common/dtos/user.dtos"
import RoleController from "../controllers/role.controller"
import { Auth as AuthService } from "../middlewares/auth"
import { CreateRoleDTO, CreateRoleParamDTO } from "../common/dtos/role.dtos"

export const setupUserRoutes = (container: IContainer) => {
    const userRouter: Router = Router()
    const userController = container.get(UserController)

    userRouter.post(
        "/business-owners",
        validator({
            body: CreateSuperAdminDTO,
        }),
        userController.createAdminUser.bind(userController)
    )

    userRouter.post(
        "/auth",
        validator({
            body: AuthUserDto,
        }),
        userController.authUser.bind(userController)
    )

    userRouter.get("/", userController.getAllUsers.bind(userController))

    return userRouter
}

export const setupCompanyRoutes = (container: IContainer) => {
    const cRouter: Router = Router()
    const userController = container.get(UserController)
    const roleController = container.get(RoleController)

    const authService = container.get(AuthService)

    cRouter.post(
        "/:companyId/invite-user",
        validator({
            body: CreateUserDTO,
            param: CreateRoleParamDTO,
        }),
        userController.inviteUser.bind(userController)
    )

    cRouter.get(
        "/:companyId/roles",
        validator({
            param: CreateRoleParamDTO,
        }),
        authService.auth("view-roles"),
        roleController.getAllRoles.bind(roleController)
    )

    cRouter.post(
        "/:companyId/roles",
        validator({
            body: CreateRoleDTO,
            param: CreateRoleParamDTO,
        }),
        roleController.createCustomRole.bind(roleController)
    )

    return cRouter
}
