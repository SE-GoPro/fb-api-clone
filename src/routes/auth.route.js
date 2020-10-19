import { Router } from 'express';
import authController from 'controllers/auth.controller';
import asyncRoute from 'utils/asyncRoute';
import handleResponse from 'utils/handleResponses';
import verifyToken from 'middlewares/verifyToken';
import authValidation from 'validations/auth.validation';

const router = Router();

router.post('/signup', authValidation.signup, asyncRoute(async (req, res) => {
  const { phonenumber, password } = req.body;
  const data = await authController.signup(phonenumber, password);
  return handleResponse(res, data);
}));

router.post('/login', authValidation.login, asyncRoute(async (req, res) => {
  const { phonenumber, password } = req.body;
  const data = await authController.login(phonenumber, password);
  return handleResponse(res, data);
}));

router.post('/logout', authValidation.logout, verifyToken, asyncRoute(async (req, res) => {
  const { token } = req.body;
  const { userId } = req.credentials;
  await authController.logout(userId, token);
  return handleResponse(res);
}));

router.post('/get_verify_code', authValidation.getVerifyCode, asyncRoute(async (req, res) => {
  const { phonenumber } = req.body;
  const data = await authController.getVerifyCode(phonenumber);
  return handleResponse(res, data);
}));

router.post('/check_verify_code', authValidation.checkVerifyCode, asyncRoute(async (req, res) => {
  const { phonenumber, code_verify: verifyCode } = req.body;
  const data = await authController.checkVerifyCode(phonenumber, verifyCode);
  return handleResponse(res, data);
}));

export default router;
