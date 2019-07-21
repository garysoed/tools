import chalk from 'chalk';

import { MessageType } from './message-type';

export function colorize(type: MessageType, text: string): string {
  switch (type) {
    case MessageType.ALERT:
      return chalk.magenta(text);
    case MessageType.DEBUG:
      return chalk.gray(text);
    case MessageType.FAILURE:
      return chalk.red(text);
    case MessageType.INFO:
      return chalk.blue(text);
    case MessageType.PROGRESS:
      return chalk.white(text);
    case MessageType.MISSING:
      return chalk.yellow(text);
    case MessageType.SUCCESS:
      return chalk.green(text);
    case MessageType.WARNING:
      return chalk.yellow(text);
  }
}
