import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"
import { APIError, ConflictError } from "../common/errors"
import {
    AuthUserDto,
    CreateSuperAdminDTO,
    CreateUserDTO,
} from "../common/dtos/user.dtos"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"
import { Repository } from "typeorm"
import User from "../entities/user.entity"
import Company from "../entities/company.entity"
import { UserToCompany } from "src/entities/user-to-company.entity"
import { Role } from "../entities/role.entity"

@Service("user_service")
export default class UserService {
    constructor(
        @Inject("user_repository") public userRepository: Repository<User>,
        @Inject("company_repository")
        public companyRepository: Repository<Company>,
        @Inject("user_to_company_repository")
        public userToCompanyRepo: Repository<UserToCompany>,
        @Inject("role_repository") public roleRepository: Repository<Role>
    ) {
        this.userRepository = userRepository
    }

    private async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async createUser(data: CreateUserDTO, companyId: string) {
        const existingUser = await this.userRepository.findOne({
            where: {
                email: data.email.toLowerCase(),
            },
        })
        if (existingUser) {
            const partOfCompany = await this.userToCompanyRepo.findOne({
                where: {
                    userId: existingUser.id,
                    companyId,
                },
            })
            if (partOfCompany) {
                throw new ConflictError(
                    "User with this email already exists and is part of your company"
                )
            }
        }

        const role = await this.roleRepository.findOne({
            where: {
                id: data.roleId,
            },
        })

        if (!role) {
            throw new APIError("Role not found", 404)
        }

        const hashedPassword = await this.hashPassword(data.password)
        let user
        if (!existingUser) {
            user = await this.userRepository
                .create({
                    ...data,
                    password: hashedPassword,
                })
                .save()
        } else {
            user = existingUser
        }

        const userToCompany = this.userToCompanyRepo.create({
            userId: user.id,
            companyId: companyId,
            roleId: role.id,
        })

        this.userToCompanyRepo.save(userToCompany)
        return userToCompany
    }

    async createSuperAdmin(data: CreateSuperAdminDTO) {
        // add transaction for atomicity
        let company = this.companyRepository.create({
            companyName: data.companyName,
        })

        company = await this.companyRepository.save(company)

        let user = this.userRepository.create({
            lastName: data.lastName,
            firstName: data.firstName,
            password: await this.hashPassword(data.password),
            email: data.email,
        })

        user = await this.userRepository.save(user)

        const superAdminRole = await this.roleRepository.findOne({
            where: {
                name: "super-admin",
            },
        })

        if (!superAdminRole) {
            throw new APIError("Could not create supper admin user", 500)
        }

        const userToCompany = this.userToCompanyRepo.create({
            userId: user.id,
            companyId: company.id,
            roleId: superAdminRole.id,
        })

        this.userToCompanyRepo.save(userToCompany)
        return userToCompany
    }

    async getUsers(): Promise<User[]> {
        return this.userRepository.find({
            relations: {
                userToCompanies: {
                    role: true,
                    company: true,
                },
            },
        })
    }

    public async auth(
        authUserDto: AuthUserDto
    ): Promise<{ accessToken: string; user: Omit<User, "password"> }> {
        const { email: userEmail, password: userPassword } = authUserDto
        let user = await this.userRepository.findOne({
            where: {
                email: userEmail.toLowerCase(),
            },
            relations: {
                userToCompanies: {
                    role: true,
                    company: true,
                },
            },
        })

        if (!user) {
            throw new APIError("User not found", 404)
        }

        const comparePasswordResult = await this.comparePassword(
            userPassword,
            user.password!
        )
        if (!comparePasswordResult) {
            throw new APIError("Invalid password", 401)
        }

        const { accessToken } = await this.generateToken(user)
        const userWithoutPassword = _.omit(user, "password")

        return { accessToken, user: userWithoutPassword }
    }

    public async generateToken(user: User): Promise<{ accessToken: string }> {
        const payload = {
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userToCompanies: user.userToCompanies,
        }
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                config.get<string>("jwtSecret"),
                {
                    // expiresIn: '600000'
                    expiresIn: "18000000",
                },
                (err: any, token) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve({ accessToken: token as string })
                }
            )
        })
    }

    public async comparePassword(inputPass: string, password: string) {
        return bcrypt.compare(inputPass, password)
    }
}
