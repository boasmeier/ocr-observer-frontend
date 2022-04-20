import { Injectable } from '@angular/core';

import { Logger } from '../logger/Logger'
import { ConsoleLogger } from '../logger/ConsoleLogger';

@Injectable({
    providedIn: 'root',       // root ^= singleton
})
export class MessageService {
    messages: string[] = [];
    loggers: Logger[] = [];

    constructor() {
        this.loggers.push(new ConsoleLogger());
    }

    error(message: string) {
        this.messages.push(message);
        this.loggers.forEach(logger => {
            logger.error(message);
        });
    }

    warn(message: string) {
        this.messages.push(message);
        this.loggers.forEach(logger => {
            logger.debug(message);
        });
    }

    info(message: string) {
        this.messages.push(message);
        this.loggers.forEach(logger => {
            logger.info(message);
        });
    }

    debug(message: string) {
        this.messages.push(message);
        this.loggers.forEach(logger => {
            logger.debug(message);
        });
    }

    clear() {
        this.messages = [];
    }
}