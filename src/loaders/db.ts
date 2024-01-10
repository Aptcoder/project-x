import { DataSource, DataSourceOptions } from "typeorm"
import config from "config"
import { SeederOptions } from "typeorm-extension"

const options: DataSourceOptions & SeederOptions = {
    type: "postgres",
    url: config.get<string>("database_url"),
    logging: false,
    migrations: ["src/migrations/**/*.ts"],
    entities: ["src/**/*.entity.ts"],
    ssl: config.get<boolean>("database.ssl"),

    seeds: ["src/**/*.seeder.ts"],
    synchronize: true,
}

const AppDataSource = new DataSource(options)

// AppDataSource.initialize()
//     .then(() => {
//         console.log("Data Source has been initialized!")
//     })
//     .catch((err: any) => {
//         console.error("Error during Data Source initialization", err)
//     })

export default AppDataSource
