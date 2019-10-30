import chalk from 'chalk';

import { LogLevel } from '@santa';


export function colorize(type: LogLevel, text: string): string {
  switch (type) {
    case LogLevel.ERROR:
      return chalk.red.bold(text);
    case LogLevel.DEBUG:
      return chalk.gray(text);
    case LogLevel.INFO:
      return chalk.white(text);
    case LogLevel.FAILURE:
      return chalk.red(text);
    case LogLevel.PROGRESS:
      return chalk.cyan(text);
    case LogLevel.SUCCESS:
      return chalk.green.bold(text);
    case LogLevel.WARNING:
      return chalk.yellow(text);
  }
}
