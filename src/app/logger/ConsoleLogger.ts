import { Injectable } from '@angular/core';
import { Logger, LogLevel } from "./Logger";

export class ConsoleLogger implements Logger {
    private level: LogLevel;
    private logWithDate: Boolean;

    constructor(level: LogLevel = LogLevel.All, logWithDate: Boolean = true) {
        this.level = level;
        this.logWithDate = logWithDate;
    }

    public debug(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Debug, optionalParams);
    }
    
    public info(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Info, optionalParams);
    }
    
    public warn(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Warn, optionalParams);
    }
    
    public error(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Error, optionalParams);
    }
    
    public fatal(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Fatal, optionalParams);
    }
    
    public log(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.All, optionalParams);
    }

    private shouldLog(level: LogLevel): boolean {
        let ret: boolean = false;
        if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
            ret = true;
        }
        return ret;
    }

    private writeToLog(msg: string, level: LogLevel, params: any[]) {
        if (this.shouldLog(level)) {
            let value: string = "";
            
            // Build log string
            if (this.logWithDate) {
                value = new Date().toUTCString() + " - ";
            }
            
            value += "Type: " + LogLevel[level];
            value += " - Message: " + msg;
            if (params.length) {
                value += " - Extra Info: " + this.formatParams(params);
            }
            
            // Log the value
            console.log(value);
        }
    }

    private formatParams(params: any[]): string {
        let ret: string = params.join(",");
        
        // Is there at least one object in the array?
        if (params.some(p => typeof p == "object")) {
            ret = "";
            
            // Build comma-delimited string
            for (let item of params) {
                ret += JSON.stringify(item) + ",";
            }
        }
        return ret;
    }
}