import * as winston from 'winston';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  public static getInstance(): Logger {
    return Logger.instance;
  }

  private static instance: Logger = new Logger();

  public logger: winston.Logger;

  constructor() {
    if (Logger.instance) {
      throw new Error('Error: Instantiation failed, Use LoggerService.getInstance()');
    }
    this.configureWinston();
    Logger.instance = this;
  }


  public debug(msg: string, data?: any, context?: any, event?: any): void {
    msg = this.prepMsg(msg, event);
    this.log('debug', msg, data, context, event);
  }

  public info(msg: string, data?: any, context?: any, event?: any): void {
    msg = this.prepMsg(msg, event);
    this.log('info', msg, data, context, event);
  }

  public warn(msg: string, data?: any, context?: any, event?: any): void {
    msg = this.prepMsg(msg, event);
    this.log('warn', msg, data, context, event);
  }

  public error(msg: string, data?: any, context?: any, event?: any): void {
    msg = this.prepMsg(msg, event);
    this.log('error', msg, data, context, event);
  }


  private configureWinston(): void {
    const prettyPrint = winston.format.printf(info => {
      return JSON.stringify(info);
    });
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: prettyPrint,
      transports: [ new winston.transports.Console() ],
    });
  }

  private log(level: LogLevel, msg: string, data?: any, context?: any, event?: any): void {
    this.configureWinston();
    this.logger.log(level, msg, data);
  }

  private prepMsg(msg: string, event: any): string {
    msg = `${msg}`;
    if (event) {
      msg = `Path Parameters: ${JSON.stringify(event.pathParameters)} - Body: ${JSON.stringify(event.body)} - ${msg}`;
    }
    return msg;
  }

}
