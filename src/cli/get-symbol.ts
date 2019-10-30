import { LogLevel } from '@santa';

export function getSymbol(type: LogLevel): string {
  switch (type) {
    case LogLevel.ERROR:
      return '‼';
    case LogLevel.DEBUG:
      return '⚙';
    case LogLevel.FAILURE:
      return '✖';
    case LogLevel.INFO:
      return '•';
    case LogLevel.PROGRESS:
      return '…';
    case LogLevel.SUCCESS:
      return '✔';
    case LogLevel.WARNING:
      return '!';
  }
}
