import { init } from "../common/services/cache/redis.setup"
import Container from "typedi"
import { RedisCache } from "cache-manager-redis-yet"
import { CacheService } from "../common/services/cache/cache.service"
import LoggerService from "../common/services/logger"
import { ILogger } from "../common/interfaces/services.interfaces"
import ReviewRepository from "../repositories/review.repository"
import { MemoryCache } from "cache-manager"

export const initContainer = async () => {
    Container.set({ id: "logger", type: LoggerService })
    const logger = Container.get<ILogger>("logger")
    const redisCache: RedisCache | MemoryCache = await init(logger)

    // external services
    const cacheService = new CacheService(redisCache)
    Container.set({ id: "cache_service", value: cacheService })

    return Container
}
