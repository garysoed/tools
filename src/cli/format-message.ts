import { LogLevel } from '@santa';

import { colorize } from './colorize';
import { getSymbol } from './get-symbol';

const COL_WIDTH = 80;
const PREFIX_WIDTH = 4;
const INDENT = '  ';

function formatLine(prefix: string, text: string, pad: string): string {
  return `${prefix} ${pad}${text}`;
}

function formatMessageLine(type: LogLevel, text: string, indent: number = 0): string {
  const textWidth = COL_WIDTH - PREFIX_WIDTH - indent * INDENT.length;

  // Split the text into multiple lines.
  const lines = [];
  const spacePrefix = text.match(/^( )*/)![0];
  const segments = text.split(' ');
  let line = '';
  for (const segment of segments) {
    if (line.length + segment.length + 1 > textWidth) {
      lines.push(line);
      line = segment;
    } else {
      const pad = line.length > 0 ? ' ' : '';
      line += `${pad}${segment}`;
    }
  }

  if (line.length > 0) {
    lines.push(line);
  }

  let pad = spacePrefix;
  for (let i = 0; i < indent; i++) {
    pad += INDENT;
  }

  const [firstLine, ...restLines] = lines;
  const rendered = [
    formatLine(`[${getSymbol(type)}]`, firstLine || '', pad),
    ...restLines.map(line => formatLine(`   `, line, pad)),
  ];

  return rendered.map(line => colorize(type, line)).join('\n');
}

export function formatMessage(type: LogLevel, text: string, indent: number = 0): string {
  return text.split('\n').map(line => formatMessageLine(type, line, indent)).join('\n');
}
