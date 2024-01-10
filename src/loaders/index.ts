/* eslint-disable import/prefer-default-export */
import { Application } from "express"
import { initContainer } from "./container"
import "./db"
import { ILogger } from "../common/interfaces/services.interfaces"

async function init({ expressApp }: { expressApp: Application }) {
    const Container = await initContainer()
    const { loadApp } = await import("./app")
    await loadApp({ app: expressApp, Container: Container })

    return Container
}

export { init }
