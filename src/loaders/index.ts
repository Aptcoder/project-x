/* eslint-disable import/prefer-default-export */
import { Application } from "express"
import { initContainer } from "./container"
import "./db"
import { runSeeders } from "typeorm-extension"
import AppDataSource from "./db"

async function init({ expressApp }: { expressApp: Application }) {
    const Container = await initContainer()

    await AppDataSource.initialize()
    await runSeeders(AppDataSource)

    const { loadApp } = await import("./app")
    await loadApp({ app: expressApp, Container: Container })

    return Container
}

export { init }
