/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/no-named-as-default
import app from './app.js';
import logger from './config/logger.js';

const port = process.env.PORT || 3500;

app.listen(port, () => {
  logger.log({
    level: 'info',
    message: `Server listening on ${port}`,
  });
});
