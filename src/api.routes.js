import express from 'express';

import main from './main.route.js';

const router = express.Router();

router.use('/', main);

export default router;
