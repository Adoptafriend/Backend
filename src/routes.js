import express from 'express';
import path from 'path';
// import redirectToLogin from './auth/redirect-to-login.js';
// import { notFound, errorHandler } from './shared/error/error-handling.js';
import authRoutes from './auth/auth.routes.js';
import apiRoutes from './api.routes.js';
// import webRoutes from './web.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
// router.use(redirectToLogin);
router.use('/api', apiRoutes);
// router.use('*', (req, res) => {
//   res.sendFile('/index.html');
// });
// router.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, './public', 'index.html'));
// });

// router.use(notFound);
// router.use(errorHandler);

export default router;
