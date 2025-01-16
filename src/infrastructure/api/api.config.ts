import { env } from 'node:process';

export default {
  env: env['NODE_ENV'],
  port: env['PORT'],
};
