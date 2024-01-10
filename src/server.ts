import "reflect-metadata"
import config from "config"
import express from "express"
import * as loader from "./loaders"
import LoggerService from "./common/services/logger"

const PORT: string = config.get<string>("port")

async function startServer() {
    const app = express()

    const Container = await loader.init({ expressApp: app })
    const logger = Container.get(LoggerService)
    app.listen(PORT, (): void => {
        logger.info(`Server is running at port: ${PORT}`)
    })
}

startServer()
