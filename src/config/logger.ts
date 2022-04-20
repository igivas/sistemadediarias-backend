import { Logger, QueryRunner } from 'typeorm';
import appRootPath from 'app-root-path';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

export default class MyCustomLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    if (!query.includes('SELECT')) {
      const sql =
        query +
        (parameters && parameters.length
          ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
          : '');
      this.write(`[QUERY]: ${sql}`, 'ormlogs.log');
    }
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): void {
    const sql =
      query +
      (parameters && parameters.length
        ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : '');
    this.write(
      [`[FAILED QUERY]: ${sql}`, `[QUERY ERROR]: ${error}`],
      'ormerrors.log',
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): void {
    const sql =
      query +
      (parameters && parameters.length
        ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : '');
    this.write(`[SLOW QUERY: ${time} ms]: ${sql}`, 'ormlogs.log');
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    console.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    console.log(message);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): void {
    switch (level) {
      case 'log':
        this.write(`[LOG]: ${message}`, 'ormlogs.log');
        break;
      case 'info':
        break;
      case 'warn':
        this.write(`[WARN]: ${message}`, 'ormerrors.log');
        break;
      default:
        console.log('log default');
    }
  }

  protected write(strings: string | string[], fileName: string): void {
    strings = Array.isArray(strings) ? strings : [strings];
    const basePath = `${appRootPath.path}/`;
    const logPath = fileName;

    strings = (strings as string[]).map(
      str => `[${new Date().toISOString()}]${str}`,
    );
    PlatformTools.appendFileSync(
      basePath + logPath,
      `${strings.join('\r\n')}\r\n`,
    ); // todo: use async or implement promises?
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]): any {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
