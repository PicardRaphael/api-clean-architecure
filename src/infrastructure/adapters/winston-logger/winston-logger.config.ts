import { env } from 'node:process';

export default {
  logLevel: env['LOG_LEVEL'],
};
