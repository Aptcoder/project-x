export interface ILogger {
    info(msg: string): ILogger
    warn(msg: string): ILogger
    error(msg: string, meta?: {}): ILogger
}
