import express from 'express';
import { authRouter } from './auth.router.js';
import { resumesRouter } from './resumes.router.js';
import { userRouter } from './users.router.js';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/resumes', validateAccessToken, resumesRouter);
router.use('/users', userRouter);

// aws 확인용
router.get('/health-check', async (req, res, next) => {
  try {
    return res.status(200).send('healthy');
  } catch (err) {
    next(err);
  }
});
export default router;
