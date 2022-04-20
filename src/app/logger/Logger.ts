
export enum LogLevel {
    All = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
    Off = 6
}

export interface Logger {
    debug(msg: string, ...optionalParams: any[]): void;
    info(msg: string, ...optionalParams: any[]): void;
    warn(msg: string, ...optionalParams: any[]): void;
    error(msg: string, ...optionalParams: any[]): void;
}