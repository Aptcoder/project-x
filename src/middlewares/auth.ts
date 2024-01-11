import config from "config"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import permissions from "src/common/permissions"
import { UserToCompany } from "src/entities/user-to-company.entity"
import User from "src/entities/user.entity"
import { Inject, Service } from "typedi"

@Service()
export class Auth {
    constructor() {}

    private verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                config.get<string>("jwtSecret"),
                (err: any, decoded: unknown) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(decoded)
                }
            )
        })
    }

    public auth =
        (permisson: (typeof permissions)[keyof typeof permissions]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const AuthorizationHeader = req.header("Authorization")
                if (!AuthorizationHeader) {
                    return res.status(401).send({
                        message: "Not allowed, Kindly log in",
                        status: "failed",
                        data: {},
                    })
                }

                const [bearer, token] = AuthorizationHeader.split(" ")
                if (!bearer || !token) {
                    return res.status(401).send({
                        message: "Not authorized, kindly log in",
                        status: "failed",
                        data: {},
                    })
                }

                const decoded = await this.verifyToken(token)
                req.user = decoded as User
                const { user } = req
                const { companyId } = req.params
                if (companyId) {
                    const userToCompanies: UserToCompany[] =
                        user.userToCompanies
                    const belongs = userToCompanies.find((utc) => {
                        return utc.companyId == companyId
                    })

                    if (!belongs) {
                        return res.status(403).send({
                            message: "Not authorized, kindly log in",
                            status: "failed",
                            data: {},
                        })
                    }

                    const { permissions } = belongs.role
                    if (!permissions.includes(permisson)) {
                        return res.status(403).send({
                            message: "Not authorized, kindly log in",
                            status: "failed",
                            data: {},
                        })
                    }
                } else {
                    return res.status(404).send({
                        message: "Not found",
                        status: "failed",
                    })
                }

                return next()
            } catch (err) {
                return res.status(401).send({
                    message: "Not authorized, kindly log in",
                    status: "failed",
                    data: {},
                })
            }
        }
}
