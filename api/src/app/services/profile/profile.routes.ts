import express from 'express';
import * as profileController from './profile.controller.js';

const router = express.Router();

router.get('/:username', profileController.getUserInfo);
router.post('/:username', profileController.updateUserInfo);

export default router;
