import express, { Application, Request, Response } from "express"
import Container from "typedi"
import { setupCompanyRoutes, setupUserRoutes } from "./user.routes"

type IContainer = typeof Container
export const setupRoutes = (Container: IContainer) => {
    const apiRouter = express.Router()
    apiRouter.use("/users", setupUserRoutes(Container))
    apiRouter.use("/companies", setupCompanyRoutes(Container))
    return apiRouter
}
