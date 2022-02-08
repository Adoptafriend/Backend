import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
// import favicon from 'serve-favicon';
import { morganMiddleware } from './config/logger.js';
// import initializeDb from './config/initialize-db.js';
// import handlebars from './config/handlebars.js';
import './auth/auth.js';
import checkAuth from './auth/check-auth.js';
import routes from './routes.js';

// await initializeDb();

const app = express();
app.set('trust proxy', process.env.NUM_OF_PROXIES);
app.get('/ip', (req, res) => res.send(req.ip));

// app.engine('.hbs', handlebars.engine);
// app.set('view engine', '.hbs');
// app.set('views', './src');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'cdn.jsdelivr.net'],
        'img-src': '*',
      },
    },
  })
);
app.use(cors({ credentials: true }));
app.use(
  rateLimit({
    max: parseInt(process.env.RATE_LIMIT, 10),
    windowMs: 5 * 60 * 1000,
  })
);
app.use(compression());
app.use(cookieParser(process.env.JWT_SECRET));
// app.use(favicon('./src/public/img/favicons/favicon.ico'));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganMiddleware);

app.use(checkAuth);
app.use('/', routes);

export default app;
