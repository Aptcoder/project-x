/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express, { Application, NextFunction, Response, Request } from "express"
import morgan from "morgan"
import { IContainer } from "../common/types"
import { setupRoutes } from "../routes/api.routes"
import { APIError } from "../common/errors"
import { ILogger } from "../common/interfaces/services.interfaces"

const loadApp = ({
    app,
    Container,
}: {
    app: Application
    Container: IContainer
}) => {
    const logger = Container.get<ILogger>("logger")

    app.use(express.json())
    app.use(morgan("combined"))

    app.use("/api", setupRoutes(Container))

    app.use("*", (req: Request, res: Response) =>
        res.status(404).send({
            status: "failed",
            message: "Endpoint not found",
            data: {},
        })
    )

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.log("er", err)
        if (!(err instanceof APIError)) {
            logger.error(`Unexpected error: ${err}`)
        }

        if (err.type && err.type === "entity.parse.failed") {
            return res
                .status(400)
                .send({ status: "failed", message: err.message }) // Bad request
        }
        const message = err.message || "Something unexpected happened"
        return res.status(err.status || 500).send({
            status: "failed",
            message,
        })
    })

    return app
}

export { loadApp }
