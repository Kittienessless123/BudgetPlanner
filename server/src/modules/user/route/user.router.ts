import { Router } from 'express';
import { UserController } from '../controller/user.controller.ts'; // путь к контроллеру пользователя
import { authMiddleware } from '@shared/middlewares/auth.middleware.ts'; // путь к middleware

const UserRouter = Router();

UserRouter.use(authMiddleware);

const userController = new UserController();

UserRouter.get('/user', userController.getUserDataByPk.bind(userController));          // получение информации
UserRouter.post('/user', userController.updateUser.bind(userController));          // изменение данных
UserRouter.delete('/user', userController.deleteAccount.bind(userController));     // удаление аккаунта

UserRouter.get('/myWallets', userController.getMyWallets.bind(userController));    // кошельки
UserRouter.get('/myDebts', userController.getMyDebts.bind(userController));        // долги
UserRouter.get('/myStats', userController.getMyStats.bind(userController));        // статистика

export default UserRouter;