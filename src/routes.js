import express from 'express';
// import redirectToLogin from './auth/redirect-to-login.js';
// import { notFound, errorHandler } from './shared/error/error-handling.js';
import authRoutes from './auth/auth.routes.js';
import apiRoutes from './api.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
// router.use(redirectToLogin);
router.use('/api', apiRoutes);
router.get('/*', (req, res) => {
  res.sendFile('index.html', { root: './build' });
});

// router.use(notFound);
// router.use(errorHandler);

export default router;
