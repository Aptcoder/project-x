/* eslint-disable import/prefer-default-export */
import { Application } from "express"
import { initContainer } from "./container"
import initDb from "./db"
import { ILogger } from "../common/interfaces/services.interfaces"

async function init({ expressApp }: { expressApp: Application }) {
    const Container = await initContainer()
    await initDb(Container.get<ILogger>("logger"))
    const { loadApp } = await import("./app")
    await loadApp({ app: expressApp, Container: Container })

    return Container
}

export { init }
