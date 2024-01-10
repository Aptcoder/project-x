import express, { Application, Request, Response } from "express"
import Container from "typedi"

type IContainer = typeof Container
export const setupRoutes = (Container: IContainer) => {
    const apiRouter = express.Router()

    return apiRouter
}
