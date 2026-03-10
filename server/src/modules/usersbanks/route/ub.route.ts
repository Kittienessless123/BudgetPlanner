import { Router } from 'express';
import { UserBankController } from '../controller/ub.controller.ts';
import { authMiddleware } from '@shared/middlewares/auth.middleware.ts';

const userBankRouter = Router();
const userBankController = new UserBankController();

userBankRouter.use(authMiddleware);

userBankRouter.get('/', userBankController.getUserBanks.bind(userBankController));
userBankRouter.post('/', userBankController.addUserBank.bind(userBankController));
userBankRouter.put('/:id', userBankController.updateUserBank.bind(userBankController));
userBankRouter.delete('/:id', userBankController.removeUserBank.bind(userBankController));

userBankRouter.get('/primary', userBankController.getPrimaryBank.bind(userBankController));
userBankRouter.post('/:id/primary', userBankController.setPrimaryBank.bind(userBankController));

export default userBankRouter;