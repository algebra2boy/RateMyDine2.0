import express from 'express';
import * as authContoller from './auth.controller.js';

const router = express.Router();

router.post('/signup', authContoller.signUp);

export default router;
