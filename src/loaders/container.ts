import { init } from "../common/services/cache/redis.setup"
import Container from "typedi"
import { RedisCache } from "cache-manager-redis-yet"
import { CacheService } from "../common/services/cache/cache.service"
import LoggerService from "../common/services/logger"
import { ILogger } from "../common/interfaces/services.interfaces"
import ReviewRepository from "../repositories/review.repository"
import { MemoryCache } from "cache-manager"
import AppDataSource from "./db"
import User from "../entities/user.entity"
import Company from "../entities/company.entity"
import { Role } from "../entities/role.entity"
import { UserToCompany } from "../entities/user-to-company.entity"

export const initContainer = async () => {
    Container.set({ id: "logger", type: LoggerService })
    const logger = Container.get<ILogger>("logger")
    const redisCache: RedisCache | MemoryCache = await init(logger)

    // repos
    Container.set({
        id: "user_repository",
        value: AppDataSource.getRepository(User),
    })
    Container.set({
        id: "company_repository",
        value: AppDataSource.getRepository(Company),
    })
    Container.set({
        id: "role_repository",
        value: AppDataSource.getRepository(Role),
    })
    Container.set({
        id: "user_to_company_repository",
        value: AppDataSource.getRepository(UserToCompany),
    })

    // external services
    const cacheService = new CacheService(redisCache)
    Container.set({ id: "cache_service", value: cacheService })

    return Container
}
