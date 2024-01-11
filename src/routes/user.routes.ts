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

    cRouter.post(
        "/:companyId/invite-user",
        validator({
            body: CreateUserDTO,
        }),
        userController.inviteUser.bind(userController)
    )

    cRouter.get(
        "/:companyId/roles",
        roleController.getAllRoles.bind(roleController)
    )

    return cRouter
}
