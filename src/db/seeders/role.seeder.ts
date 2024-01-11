import { Seeder, SeederFactoryManager } from "typeorm-extension"
import { DataSource } from "typeorm"
import { Role } from "../../entities/role.entity"
import permissions from "../../common/permissions"

export default class RoleSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = dataSource.getRepository(Role)
        const rolePermissions = Object.values(permissions)
        const adminRole = await repository.findOne({
            where: {
                name: "super-admin",
            },
        })
        if (!adminRole) {
            await repository.insert([
                {
                    name: "super-admin",
                    permissions: rolePermissions,
                },
            ])
        }

        const guestUserRole = await repository.findOne({
            where: {
                name: "guest-user",
            },
        })

        if (!guestUserRole) {
            await repository.insert([
                {
                    name: "guest-user",
                    permissions: [permissions.VIEW_USERS],
                },
            ])
        }

        // ---------------------------------------------------

        // const userFactory = factoryManager.get(Role)
        // // save 1 factory generated entity, to the database
        // await userFactory.save()

        // // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5)
    }
}
