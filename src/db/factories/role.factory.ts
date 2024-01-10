import { Role } from "src/entities/role.entity"
import { setSeederFactory } from "typeorm-extension"

export default setSeederFactory(Role, (faker) => {
    const role = new Role()
    role.name = "super-admin"

    return role
})
