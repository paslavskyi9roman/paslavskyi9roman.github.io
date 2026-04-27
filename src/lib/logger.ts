import 'server-only';
import pino, { type Logger } from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug'),
  base: { app: 'madrid-noir' },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'AI_API_KEY', '*.password', '*.token'],
    censor: '[redacted]',
  },
  ...(isProd
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname,app',
          },
        },
      }),
});
