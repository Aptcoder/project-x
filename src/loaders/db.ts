import { DataSource } from "typeorm"
import config from "config"

const AppDataSource = new DataSource({
    type: "postgres",
    url: config.get<string>("database_url"),
    logging: false,
    migrations: ["src/migrations/**/*.ts"],
    entities: ["src/**/*.entity.ts"],
    ssl: config.get<boolean>("database.ssl"),
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err: any) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource
