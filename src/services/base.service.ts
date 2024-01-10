import { ILogger } from "../common/interfaces/services.interfaces"
import { Inject } from "typedi"

export default class BaseService {
    constructor(@Inject("logger") public logger: ILogger) {
        this.logger = logger
    }
}
