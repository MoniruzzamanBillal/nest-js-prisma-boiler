import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp, ms, context, ...meta }) => {
            const ctx = typeof context === 'string' ? context : 'App';
            const metaStr = Object.keys(meta).length
              ? JSON.stringify(meta)
              : '';
            return `${String(timestamp)} [${ctx}] ${String(level)}: ${String(message)} ${String(ms)} ${metaStr}`;
          },
        ),
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
};
