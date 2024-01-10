import { IUser } from "../common/interfaces/entities.interfaces"
import { IUserRepository } from "../common/interfaces/repos.interfaces"
import User from "../entities/user.entity"
import { CreateUserDTO } from "../common/dtos/user.dtos"

export default class UserRepository implements IUserRepository {
    async create(userData: CreateUserDTO) {
        const user = User.create({
            ...userData,
        })

        return user.save()
    }

    async findAll(): Promise<IUser[]> {
        return User.find({})
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await User.findOne({
            where: {
                email,
            },
        })
        return user
    }
}
