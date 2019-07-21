import { MessageType } from './message-type';

export function getSymbol(type: MessageType): string {
  switch (type) {
    case MessageType.ALERT:
      return '‼';
    case MessageType.DEBUG:
      return '⚙';
    case MessageType.FAILURE:
      return '✖';
    case MessageType.INFO:
      return '•';
    case MessageType.PROGRESS:
      return '…';
    case MessageType.MISSING:
      return '?';
    case MessageType.SUCCESS:
      return '✔';
    case MessageType.WARNING:
      return '!';
  }
}
