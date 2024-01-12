import express from 'express';
import * as authContoller from './auth.controller.js';

import { ZodMiddleware } from '../../middlewares/ZodValidation.mw.js';
import { LoginSchema, SignUpSchema } from '../../validations/auth.validation.js';

const router = express.Router();

router.post('/login', ZodMiddleware(LoginSchema), authContoller.login);
router.post('/signup', ZodMiddleware(SignUpSchema), authContoller.signUp);

export default router;
